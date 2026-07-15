import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const healingTouchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Healing Touch",
    text: "Remove up to 4 damage from chosen character. Draw a card.",
  },
  de: {
    name: "Heilende Berührung",
    text: "Entferne bis zu 4 Schaden von einem Charakter deiner Wahl. Ziehe 1 Karte.",
  },
  fr: {
    name: "Toucher guérisseur",
    text: "Choisissez un personnage et retirez-lui jusqu'à 4 dommages. Piochez une carte.",
  },
  it: {
    name: "Tocco Curativo",
    text: "Rimuovi fino a 4 danni da un personaggio a tua scelta. Pesca una carta.",
  },
};
