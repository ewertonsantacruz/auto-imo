import { supabase } from './supabase'

// Company Settings
export const fetchCompanySettings = async () => {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('status', 'published')
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching company settings:', error)
    return null
  }
}

// Branding
export const fetchBranding = async () => {
  try {
    const { data, error } = await supabase
      .from('branding')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching branding:', error)
    return null
  }
}

// Properties
export const fetchProperties = async (filters = {}) => {
  try {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (filters.property_type) {
      query = query.eq('property_type', filters.property_type)
    }
    
    if (filters.min_price) {
      query = query.gte('price', filters.min_price)
    }
    
    if (filters.max_price) {
      query = query.lte('price', filters.max_price)
    }
    
    if (filters.city) {
      query = query.eq('address_city', filters.city)
    }
    
    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms)
    }
    
    if (filters.featured) {
      query = query.eq('featured', true)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}

// Single Property
export const fetchProperty = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

// Featured Properties
export const fetchFeaturedProperties = async (limit = 6) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching featured properties:', error)
    return []
  }
}

// Blog Posts
export const fetchBlogPosts = async (limit = null) => {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Single Blog Post
export const fetchBlogPost = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Property Types
export const fetchPropertyTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('property_type')
      .eq('status', 'published')
    
    if (error) throw error
    
    // Get unique property types
    const types = [...new Set(data.map(item => item.property_type))]
    return types
  } catch (error) {
    console.error('Error fetching property types:', error)
    return []
  }
}

// Cities
export const fetchCities = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('address_city')
      .eq('status', 'published')
    
    if (error) throw error
    
    // Get unique cities
    const cities = [...new Set(data.map(item => item.address_city).filter(Boolean))]
    return cities.sort()
  } catch (error) {
    console.error('Error fetching cities:', error)
    return []
  }
}

// Search Properties
export const searchProperties = async (searchTerm, filters = {}) => {
  try {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'published')
    
    // Text search
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address_neighborhood.ilike.%${searchTerm}%`)
    }
    
    // Apply filters
    if (filters.property_type) {
      query = query.eq('property_type', filters.property_type)
    }
    
    if (filters.min_price) {
      query = query.gte('price', filters.min_price)
    }
    
    if (filters.max_price) {
      query = query.lte('price', filters.max_price)
    }
    
    if (filters.city) {
      query = query.eq('address_city', filters.city)
    }
    
    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error searching properties:', error)
    return []
  }
} 