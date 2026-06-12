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
        title: "SEID VORSICHTIG!",
        description:
          "Deine Darkwing-Duck-Charaktere erhalten Robust +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Cuicui Bourbifoot",
    version: "Génie timide",
    text: [
      {
        title: "FAIS ATTENTION!",
        description: "Vos personnages Myster Mask gagnent Résistance +1.",
      },
    ],
  },
  it: {
    name: "Tonnaso Parapiglia",
    version: "Timido Genio",
    text: [
      {
        title: "STAI ATTENTO!",
      },
      {
        title: "I",
        description: "tuoi personaggi chiamati Darkwing Duck ottengono Resistere +1.",
      },
    ],
  },
};
