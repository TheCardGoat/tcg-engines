import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const healWhatHasBeenHurtI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Heal What Has Been Hurt",
    text: "Remove up to 3 damage from chosen character. Draw a card.",
  },
  de: {
    name: "Lass mich nicht allein",
    text: "Entferne bis zu 3 Schaden von einem Charakter deiner Wahl. Ziehe 1 Karte.",
  },
  fr: {
    name: "Guéris les blessures",
    text: "Choisissez un personnage et retirez-lui jusqu'à 3 jetons Dommage. Piochez une carte.",
  },
  it: {
    name: "Incanto della Guarigione",
    text: "(Un personaggio con costo 3 o superiore può per giocare questa canzone gratis.) Rimuovi fino a 3 danni da un personaggio a tua scelta. Pesca una carta.",
  },
};
