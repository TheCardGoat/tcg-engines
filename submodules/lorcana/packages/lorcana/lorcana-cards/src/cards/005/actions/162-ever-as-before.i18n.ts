import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const everAsBeforeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ever as Before",
    text: "Remove up to 2 damage from any number of chosen characters.",
  },
  de: {
    name: "Ewig altbekannt",
    text: "Entferne bis zu 2 Schaden von beliebig vielen Charakteren deiner Wahl.",
  },
  fr: {
    name: "Rien n'est plus pareil",
    text: "Choisissez autant de personnages que vous le souhaitez et retirez-leur jusqu'à 2 dommages chacun.",
  },
  it: {
    name: "Stessa Melodia",
    text: "(Un personaggio con costo 2 o superiore può per cantare questa canzone gratis.) Rimuovi fino a 2 danni da un qualsiasi numero di personaggi a tua scelta.",
  },
};
