import { createI18n } from 'vue-i18n'
import en from './en'
import ru from './ru'

export type MessageSchema = typeof en
export type SupportedLocale = 'en' | 'ru'

const savedLocale = (localStorage.getItem('taskflow-locale') as SupportedLocale) ?? 'en'

export const i18n = createI18n<[MessageSchema], SupportedLocale>({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, ru },
  pluralRules: {
    ru: (choice: number, choicesLength: number) => {
      if (choice === 0) return choicesLength < 4 ? 2 : 3
      const teen = choice > 10 && choice < 20
      const endsWithOne = choice % 10 === 1
      if (!teen && endsWithOne) return 0
      if (!teen && choice % 10 >= 2 && choice % 10 <= 4) return 1
      return choicesLength < 4 ? 2 : 3
    },
  },
})

export function setLocale(locale: SupportedLocale): void {
  ;(i18n.global.locale as { value: SupportedLocale }).value = locale
  localStorage.setItem('taskflow-locale', locale)
  document.documentElement.lang = locale
}
