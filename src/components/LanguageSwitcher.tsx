'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe } from 'lucide-react'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧'
  },
  {
    code: 'tpi',
    name: 'Tok Pisin',
    nativeName: 'Tok Pisin',
    flag: '🇵🇬'
  }
]

interface LanguageSwitcherProps {
  variant?: 'button' | 'select'
  size?: 'sm' | 'md' | 'lg'
  showFlag?: boolean
  showNativeName?: boolean
}

export default function LanguageSwitcher({
  variant = 'select',
  size = 'md',
  showFlag = true,
  showNativeName = true
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const [isChanging, setIsChanging] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = async (languageCode: string) => {
    if (languageCode === i18n.language) return

    setIsChanging(true)
    try {
      await i18n.changeLanguage(languageCode)
      // Store preference in localStorage
      localStorage.setItem('pngElectSys_language', languageCode)
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsChanging(false)
    }
  }

  if (variant === 'button') {
    return (
      <div className="flex items-center space-x-1">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={currentLanguage.code === language.code ? 'default' : 'ghost'}
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            onClick={() => changeLanguage(language.code)}
            disabled={isChanging}
            className="flex items-center space-x-1"
          >
            {showFlag && <span>{language.flag}</span>}
            <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>
              {showNativeName ? language.nativeName : language.name}
            </span>
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className={`text-gray-600 ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      <Select
        value={currentLanguage.code}
        onValueChange={changeLanguage}
        disabled={isChanging}
      >
        <SelectTrigger className={`w-auto min-w-[140px] ${
          size === 'sm' ? 'h-8 text-sm' : size === 'lg' ? 'h-12 text-base' : 'h-10 text-sm'
        }`}>
          <SelectValue>
            <div className="flex items-center space-x-2">
              {showFlag && <span>{currentLanguage.flag}</span>}
              <span>
                {showNativeName ? currentLanguage.nativeName : currentLanguage.name}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center space-x-2">
                {showFlag && <span>{language.flag}</span>}
                <div className="flex flex-col">
                  <span className="font-medium">{language.nativeName}</span>
                  {showNativeName && language.name !== language.nativeName && (
                    <span className="text-xs text-gray-500">{language.name}</span>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isChanging && (
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      )}
    </div>
  )
}

// Hook to initialize language from localStorage
export function useLanguageInit() {
  const { i18n } = useTranslation()

  const initializeLanguage = () => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('pngElectSys_language')
      if (savedLanguage && savedLanguage !== i18n.language) {
        i18n.changeLanguage(savedLanguage)
      }
    }
  }

  return { initializeLanguage }
}
