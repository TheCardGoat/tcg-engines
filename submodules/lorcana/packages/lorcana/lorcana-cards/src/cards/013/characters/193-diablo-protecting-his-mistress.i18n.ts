import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const diabloProtectingHisMistressI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Diablo",
    version: "Protecting His Mistress",
    text: [
      {
        title: "Flurry of Feathers",
        description: "Your characters named Maleficent gain <Resist> +1.",
      },
    ],
  },
  de: {
    name: "Diablo",
    version: "Beschützt seine Herrin",
    text: [
      {
        title: "Wirbel aus Federn",
        description:
          "Deine Charaktere namens Malefiz erhalten <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Diablo",
    version: "Protège sa maîtresse",
    text: [
      {
        title: "Tourbillon de plumes",
        description: "Vos personnages nommés Maléfique gagnent <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Diablo",
    version: "Che Protegge la Sua Padrona",
    text: [
      {
        title: "Turbinio di Piume",
        description: "I tuoi personaggi chiamati Malefica ottengono <Resistere> +1.",
      },
    ],
  },
};
