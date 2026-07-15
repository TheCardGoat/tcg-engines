export const OP_LANGUAGES = ["en"] as const;
export type OPLanguage = (typeof OP_LANGUAGES)[number];

/** Localizable text fields for a card */
export interface OPCardLocale {
  name: string;
  effect?: string;
  /** Card image URL — locale-specific since card images contain localized text */
  imageUrl?: string;
}

export type OPCardI18n = Record<OPLanguage, OPCardLocale>;
