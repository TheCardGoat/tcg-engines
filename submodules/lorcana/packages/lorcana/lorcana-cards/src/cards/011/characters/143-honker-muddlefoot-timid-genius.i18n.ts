import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const honkerMuddlefootTimidGeniusI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Honker Muddlefoot",
    version: "Timid Genius",
    text: [
      {
        title: "BE CAREFUL!",
        description: "Your characters named Darkwing Duck gain Resist +1.",
      },
    ],
  },
  de: {
    name: "Alfred Wirrfuß",
    version: "Schüchternes Genie",
    text: [
      {
        title: "Seid vorsichtig!",
        description:
          "Deine Darkwing-Duck-Charaktere erhalten <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Cuicui Bourbifoot",
    version: "Génie timide",
    text: [
      {
        title: "Fais attention!",
        description: "Vos personnages Myster Mask gagnent <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Tonnaso Parapiglia",
    version: "Timido Genio",
    text: [
      {
        title: "Stai Attento!",
        description: "I tuoi personaggi chiamati Darkwing Duck ottengono <Resistere> +1.",
      },
    ],
  },
};
