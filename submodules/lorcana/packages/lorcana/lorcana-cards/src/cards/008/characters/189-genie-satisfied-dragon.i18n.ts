import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const genieSatisfiedDragonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Genie",
    version: "Satisfied Dragon",
    text: [
      {
        title: "BUG CATCHER",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Dschinni",
    version: "Zufriedener Drache",
    text: [
      {
        title: "INSEKTENFÄNGER",
        description:
          "In deinem Zug erhält dieser Charakter Wendig. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "Dragon satisfait",
    text: [
      {
        title: "CHASSEUR D'INSECTES",
        description:
          "Durant votre tour, ce personnage gagne Insaisissable. (Il peut défier des personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Genio",
    version: "Drago Soddisfatto",
    text: [
      {
        title: "ACCHIAPPA INSETTI",
        description:
          "Durante il tuo turno, questo personaggio ottiene Sfuggente. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
};
