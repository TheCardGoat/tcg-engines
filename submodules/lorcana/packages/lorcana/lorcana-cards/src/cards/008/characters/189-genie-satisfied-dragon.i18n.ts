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
        title: "Insektenfänger",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "Dragon satisfait",
    text: [
      {
        title: "Chasseur d'insectes",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier des personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Genio",
    version: "Drago Soddisfatto",
    text: [
      {
        title: "Acchiappa Insetti",
        description:
          "Durante il tuo turno, questo personaggio ottiene <Sfuggente>. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
  es: {
    name: "Genio",
    version: "Dragón satisfecho",
    text: [
      {
        title: "CAPTADOR DE ERRORES",
        description:
          "Durante tu turno, este personaje gana Evasivo. (Pueden desafiar a los personajes con Evasivo).",
      },
    ],
  },
};
