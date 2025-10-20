'use client'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

interface I18nProviderProps {
  children: React.ReactNode
}

export default function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Initialize i18n on client side only
    const initI18n = async () => {
      if (typeof window !== 'undefined') {
        try {
          const savedLanguage = localStorage.getItem('pngElectSys_language')
          if (savedLanguage && savedLanguage !== i18n.language) {
            await i18n.changeLanguage(savedLanguage)
          }
        } catch (error) {
          console.warn('Failed to initialize i18n:', error)
        }
      }
    }
    initI18n()
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
}
