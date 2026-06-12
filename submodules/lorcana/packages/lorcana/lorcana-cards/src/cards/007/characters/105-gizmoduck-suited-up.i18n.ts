import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gizmoduckSuitedUpI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gizmoduck",
    version: "Suited Up",
    text: [
      {
        title: "Resist +1",
      },
      {
        title: "BLATHERING BLATHERSKITE",
        description: "This character can challenge ready damaged characters.",
      },
    ],
  },
  de: {
    name: "Krachbumm-Ente",
    version: "Ausgerüstet",
    text: [
      {
        title: "Robust +1",
      },
      {
        title: "AUSGETROCKNETER ENTENTÜMPEL",
        description: "Dieser Charakter kann bereite, beschädigte Charaktere herausfordern.",
      },
    ],
  },
  fr: {
    name: "Robotik",
    version: "En costume",
    text: [
      {
        title: "Résistance +1",
      },
      {
        title: "NOM D'UN CIRCUIT INTÉGRÉ",
        description:
          "Ce personnage peut défier les personnages redressés s'ils ont au moins un dommage.",
      },
    ],
  },
  it: {
    name: "Robopap",
    version: "Armaturato",
    text: [
      {
        title: "Resistere +1",
      },
      {
        title: "FANFALUCA CIARLANTE",
        description: "Questo personaggio può sfidare i personaggi preparati danneggiati.",
      },
    ],
  },
};
