import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theUnderworldRiverStyxI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Underworld",
    version: "River Styx",
    text: [
      {
        title: "SAVE A SOUL",
        description:
          "Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Die Unterwelt",
    version: "Fluss Styx",
    text: [
      {
        title: "EINE SEELE RETTEN",
        description:
          "Jedes Mal, wenn einer deiner Charaktere an diesem Ort erkundet, darfst du 3 bezahlen, um eine Charakterkarte aus deinem Ablagestapel zurück auf deine Hand zu nehmen.",
      },
    ],
  },
  fr: {
    name: "Les Enfers",
    version: "Le Styx",
    text: [
      {
        title: "SAUVER UNE ÂME",
        description:
          "Chaque fois qu'un personnage sur ce lieu est envoyé à l'aventure, vous pouvez payer 3 pour reprendre en main une carte personnage de votre défausse.",
      },
    ],
  },
  it: {
    name: "L'Oltretomba",
    version: "Fiume Stige",
    text: [
      {
        title: "SALVARE UN'ANIMA",
        description:
          "Ogni volta che un personaggio va all'avventura mentre si trova in questo luogo, puoi pagare 3 per riprendere in mano una carta personaggio dai tuoi scarti.",
      },
    ],
  },
};
