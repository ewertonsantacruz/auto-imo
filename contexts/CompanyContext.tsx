'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fetchCompanySettings } from '../lib/api'

// Types for company data
interface CompanyAddress {
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

interface CompanyContact {
  phoneMain?: string
  phoneSecondary?: string
  whatsapp?: string
  emailMain?: string
  emailContact?: string
}

interface CompanyBusiness {
  cnpj?: string
  inscricaoEstadual?: string
  creci?: string
  businessHours?: string
}

interface CompanySocial {
  website?: string
  instagram?: string
  facebook?: string
  linkedin?: string
}

interface CompanyBranding {
  logo?: string
  favicon?: string
  description?: string
}

interface CompanySettings {
  id: string
  company_name: string
  address_street?: string
  address_number?: string
  address_complement?: string
  address_neighborhood?: string
  address_city?: string
  address_state?: string
  address_zip_code?: string
  address_country?: string
  phone_main?: string
  phone_secondary?: string
  whatsapp?: string
  email_main?: string
  email_contact?: string
  cnpj?: string
  inscricao_estadual?: string
  creci?: string
  business_hours?: string
  website?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  logo_url?: string
  favicon_url?: string
  company_description?: string
  status: string
  created_at: string
  updated_at: string
}

interface CompanyContextType {
  company: CompanySettings | null
  loading: boolean
  error: string | null
  refreshCompanySettings: () => Promise<void>
  companyName: string
  companyAddress: CompanyAddress | null
  companyContact: CompanyContact | null
  companyBusiness: CompanyBusiness | null
  companySocial: CompanySocial | null
  companyBranding: CompanyBranding | null
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [company, setCompany] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCompanySettings = async () => {
      try {
        setLoading(true)
        const data = await fetchCompanySettings()
        if (data) {
          setCompany(data)
          // Update CSS variables for branding
          updateBrandingVariables(data)
        } else {
          setError('Não foi possível carregar as informações da empresa')
        }
      } catch (err) {
        console.error('Error loading company settings:', err)
        setError('Erro ao carregar configurações da empresa')
      } finally {
        setLoading(false)
      }
    }

    loadCompanySettings()
  }, [])

  // Update CSS variables when company settings change
  const updateBrandingVariables = (companyData: CompanySettings) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      
      // Update color variables if branding exists
      if (companyData.logo_url) {
        root.style.setProperty('--company-logo', companyData.logo_url)
      }
      if (companyData.favicon_url) {
        root.style.setProperty('--company-favicon', companyData.favicon_url)
      }
    }
  }

  // Refresh company settings (useful for admin updates)
  const refreshCompanySettings = async () => {
    try {
      setLoading(true)
      const data = await fetchCompanySettings()
      if (data) {
        setCompany(data)
        updateBrandingVariables(data)
        setError(null)
      }
    } catch (err) {
      console.error('Error refreshing company settings:', err)
      setError('Erro ao atualizar configurações da empresa')
    } finally {
      setLoading(false)
    }
  }

  const value: CompanyContextType = {
    company,
    loading,
    error,
    refreshCompanySettings,
    // Helper functions
    companyName: company?.company_name || 'Imobiliária',
    companyAddress: company ? {
      street: company.address_street,
      number: company.address_number,
      complement: company.address_complement,
      neighborhood: company.address_neighborhood,
      city: company.address_city,
      state: company.address_state,
      zipCode: company.address_zip_code,
      country: company.address_country || 'Brasil'
    } : null,
    companyContact: company ? {
      phoneMain: company.phone_main,
      phoneSecondary: company.phone_secondary,
      whatsapp: company.whatsapp,
      emailMain: company.email_main,
      emailContact: company.email_contact
    } : null,
    companyBusiness: company ? {
      cnpj: company.cnpj,
      inscricaoEstadual: company.inscricao_estadual,
      creci: company.creci,
      businessHours: company.business_hours
    } : null,
    companySocial: company ? {
      website: company.website,
      instagram: company.instagram,
      facebook: company.facebook,
      linkedin: company.linkedin
    } : null,
    companyBranding: company ? {
      logo: company.logo_url,
      favicon: company.favicon_url,
      description: company.company_description
    } : null
  }

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  )
}

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within CompanyProvider')
  }
  return context
}

// Custom hook for company address formatting
export const useCompanyAddress = (): string => {
  const { companyAddress } = useCompany()
  
  if (!companyAddress) return ''
  
  const parts = [
    companyAddress.street,
    companyAddress.number,
    companyAddress.complement,
    companyAddress.neighborhood,
    `${companyAddress.city} - ${companyAddress.state}`,
    `CEP: ${companyAddress.zipCode}`,
    companyAddress.country
  ].filter(Boolean)
  
  return parts.join(', ')
}

// Custom hook for company contact
export const useCompanyContact = (): CompanyContact => {
  const { companyContact } = useCompany()
  
  return {
    phoneMain: companyContact?.phoneMain || '',
    phoneSecondary: companyContact?.phoneSecondary || '',
    whatsapp: companyContact?.whatsapp || '',
    emailMain: companyContact?.emailMain || '',
    emailContact: companyContact?.emailContact || ''
  }
} 