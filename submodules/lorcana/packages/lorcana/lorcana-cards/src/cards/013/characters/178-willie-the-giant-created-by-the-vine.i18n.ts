import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const willieTheGiantCreatedByTheVineI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Willie the Giant",
    version: "Created by the Vine",
    text: [
      {
        title: "Defend the Stalk",
        description: "Your Floodborn characters gain <Resist> +1.",
      },
    ],
  },
  de: {
    name: "Willie der Riese",
    version: "Von der Ranke erschaffen",
    text: [
      {
        title: "Beschützt die Ranke",
        description:
          "Deine Flutgestalt-Charaktere erhalten <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Willie le géant",
    version: "Créé par la Plante",
    text: [
      {
        title: "Défendre la tige",
        description: "Vos personnages Floodborn gagnent <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Willie il Gigante",
    version: "Creato dal Viticcio",
    text: [
      {
        title: "Difendere il Fusto",
        description: "I tuoi personaggi Imbevuto ottengono <Resistere> +1.",
      },
    ],
  },
};
