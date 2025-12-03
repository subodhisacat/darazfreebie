import { supabase } from './supabase'

const TOKENS_PER_VIEW = 1
const TOKENS_PER_CLICK = 5

export async function logAdView(adId: number, userId: string) {
  try {
    // Check if user already viewed this ad
    const { data: existing } = await supabase
      .from('ad_interactions')
      .select('id')
      .eq('ad_id', adId)
      .eq('user_id', userId)
      .eq('type', 'view')
      .single()

    if (existing) {
      console.log('User already viewed this ad')
      return
    }

    // Log the view
    const { error: insertError } = await supabase
      .from('ad_interactions')
      .insert({
        ad_id: adId,
        user_id: userId,
        type: 'view',
      })

    if (insertError) throw insertError

    // Award tokens
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ tokens: profile.tokens + TOKENS_PER_VIEW })
      .eq('id', userId)

    if (updateError) throw updateError

    return true
  } catch (error) {
    console.error('Error logging ad view:', error)
    throw error
  }
}

export async function logAdClick(adId: number, userId: string) {
  try {
    // Log the click
    const { error: insertError } = await supabase
      .from('ad_interactions')
      .insert({
        ad_id: adId,
        user_id: userId,
        type: 'click',
      })

    if (insertError) throw insertError

    // Award tokens
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

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

export async function createAd(
  userId: string,
  title: string,
  description: string,
  link: string,
  tokensToSpend: number
) {
  try {
    // Check if user has enough tokens
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError
    if (profile.tokens < tokensToSpend) {
      throw new Error('Insufficient tokens')
    }

    // Create ad
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

    // Deduct tokens
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

export async function getAvailableAds(userId: string) {
  try {
    // Get ads, excluding the user's own ads
    const { data: ads, error } = await supabase
      .from('ads')
      .select('*,profiles(username)')
      .neq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return ads || []
  } catch (error) {
    console.error('Error fetching ads:', error)
    throw error
  }
}

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
