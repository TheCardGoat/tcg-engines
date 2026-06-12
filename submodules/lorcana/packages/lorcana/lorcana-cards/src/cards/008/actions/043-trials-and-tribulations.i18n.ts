import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trialsAndTribulationsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Trials and Tribulations",
    text: "Chosen character gets -4 {S} until the start of your next turn.",
  },
  de: {
    name: "Oft war ich verzweifelt",
    text: "Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -4.",
  },
  fr: {
    name: "Je travaillerai sans trêve",
    text: "Choisissez un personnage qui subit -4 jusqu'au début de votre prochain tour.",
  },
  it: {
    name: "Mille Ostacoli e Impedimenti",
    text: "(Un personaggio con costo 2 o superiore può per cantare questa canzone gratis.) Un personaggio a tua scelta riceve -4 fino all'inizio del tuo prossimo turno.",
  },
};
