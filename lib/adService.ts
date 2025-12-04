import { supabase } from './supabase'

const TOKENS_PER_CLICK = 1 // ✅ ONLY 1 TOKEN PER AD

// ✅ LOG AD CLICK (ONLY ONCE PER USER PER AD - LIFETIME)
export async function logAdClick(adId: number, userId: string) {
  try {
    // 1️⃣ Check if already clicked EVER
    const { data: existing } = await supabase
      .from('ad_interactions')
      .select('id')
      .eq('ad_id', adId)
      .eq('user_id', userId)
      .eq('type', 'click')
      .single()

    if (existing) {
      throw new Error('Ad already clicked by this user')
    }

    // 2️⃣ Insert click record
    const { error: insertError } = await supabase
      .from('ad_interactions')
      .insert({
        ad_id: adId,
        user_id: userId,
        type: 'click',
      })

    if (insertError) throw insertError

    // 3️⃣ Get current tokens
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    // 4️⃣ Add ONLY +1 token
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ tokens: profile.tokens + TOKENS_PER_CLICK })
      .eq('id', userId)

    if (updateError) throw updateError

    return true
  } catch (error) {
    console.error('Error logging ad click:', error)
    throw error
  }
}

// ✅ CREATE AD (SAFE)
export async function createAd(
  userId: string,
  title: string,
  description: string,
  link: string,
  tokensToSpend: number
) {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError
    if (profile.tokens < tokensToSpend) {
      throw new Error('Insufficient tokens')
    }

    const { data: ad, error: adError } = await supabase
      .from('ads')
      .insert({
        user_id: userId,
        title,
        description,
        link,
        tokens_spent: tokensToSpend,
      })
      .select()
      .single()

    if (adError) throw adError

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ tokens: profile.tokens - tokensToSpend })
      .eq('id', userId)

    if (updateError) throw updateError

    return ad
  } catch (error) {
    console.error('Error creating ad:', error)
    throw error
  }
}

// ✅ GET ADS USER HAS NOT SEEN TODAY + NOT OWN ADS
export async function getAvailableAds(userId: string) {
  try {
    // ✅ Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0]

    // ✅ Get ads the user already saw TODAY
    const { data: seenToday } = await supabase
      .from('ad_interactions')
      .select('ad_id')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)

    const seenIds = seenToday?.map(a => a.ad_id) || []

    // ✅ Base query
    let query = supabase
      .from('ads')
      .select('*,profiles(username)')
      .neq('user_id', userId)
      .order('created_at', { ascending: false })

    // ✅ Exclude ads already seen today
    if (seenIds.length > 0) {
      query = query.not('id', 'in', `(${seenIds.join(',')})`)
    }

    const { data: ads, error } = await query

    if (error) throw error
    return ads || []
  } catch (error) {
    console.error('Error fetching ads:', error)
    throw error
  }
}

// ✅ GET USER OWN ADS
export async function getUserAds(userId: string) {
  try {
    const { data: ads, error } = await supabase
      .from('ads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return ads || []
  } catch (error) {
    console.error('Error fetching user ads:', error)
    throw error
  }
}
