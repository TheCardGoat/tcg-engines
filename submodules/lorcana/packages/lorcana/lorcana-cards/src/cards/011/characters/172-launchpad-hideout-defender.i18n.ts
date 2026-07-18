import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const launchpadHideoutDefenderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Launchpad",
    version: "Hideout Defender",
    text: [
      {
        title: "STAND GUARD",
        description: "Your locations gain Resist +1.",
      },
    ],
  },
  de: {
    name: "Quack, der Bruchpilot",
    version: "Verteidiger des Verstecks",
    text: [
      {
        title: "Wache stehen",
        description:
          "Deine Orte erhalten <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Flagada Jones",
    version: "Défenseur de la cachette",
    text: [
      {
        title: "Monte la garde",
        description: "Vos lieux gagnent <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Jet",
    version: "Difensore del Nasondiglio",
    text: [
      {
        title: "Fare la Guardia",
        description: "I tuoi luoghi ottengono <Resistere> +1.",
      },
    ],
  },
  es: {
    name: "Plataforma de lanzamiento",
    version: "Defensor del escondite",
    text: [
      {
        title: "GUARDIA DE PIE",
        description: "Tus ubicaciones obtienen Resistencia +1.",
      },
    ],
  },
};
