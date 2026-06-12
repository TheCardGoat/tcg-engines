import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicBroomTheBigSweeperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Broom",
    version: "The Big Sweeper",
    text: [
      {
        title: "CLEAN SWEEP",
        description: "While this character is at a location, it gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Zauberbesen",
    version: "Der große Feger",
    text: [
      {
        title: "SAUBERER FEGER",
        description: "Solange dieser Charakter an einem Ort ist, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Balais magiques",
    version: "Le grand nettoyeur",
    text: [
      {
        title: "NETTOYEUR DE GRANDES SURFACES",
        description: "Tant que ce personnage se trouve sur un lieu, il gagne +2.",
      },
    ],
  },
  it: {
    name: "Scopa Magica",
    version: "Il Grande Spazzino",
    text: [
      {
        title: "PULIZIA PROFONDA",
        description: "Mentre questo personaggio si trova in un luogo, riceve +2.",
      },
    ],
  },
};
