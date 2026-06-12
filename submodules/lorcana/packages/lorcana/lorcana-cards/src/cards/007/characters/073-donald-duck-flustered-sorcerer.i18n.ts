import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckFlusteredSorcererI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Flustered Sorcerer",
    text: [
      {
        title: "OBFUSCATE!",
        description: "Opponents need 25 lore to win the game.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Aufgeregter Zauberer",
    text: [
      {
        title: "VERWIRREN!",
        description: "Gegnerische Mitspielende brauchen 25 Legenden, um das Spiel zu gewinnen.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Sorcier exaspéré",
    text: [
      {
        title: "OBFUSCATION!",
        description: "Les adversaires ont besoin de 25 éclats de Lore pour gagner la partie.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Stregone Agitato",
    text: [
      {
        title: "OTTENEBRARE!",
        description: "Gli avversari hanno bisogno di 25 leggenda per vincere la partita.",
      },
    ],
  },
};
