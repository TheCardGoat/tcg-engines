import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const grabYourBowI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Grab Your Bow",
    text: "Banish up to 2 chosen characters with 2 {S} or less.",
  },
  de: {
    name: "Nehmt den Pfeil",
    text: "Verbanne bis zu 2 Charaktere deiner Wahl mit 2 oder weniger.",
  },
  fr: {
    name: "À vos flèches",
    text: "Choisissez jusqu'à 2 personnages ayant 2 ou moins et bannissez-les.",
  },
  it: {
    name: "Siamo Eroi",
    text: "(Un personaggio con costo 5 o superiore può per cantare questa canzone gratis.) Esilia fino a 2 personaggi a tua scelta con 2 o inferiore.",
  },
};
