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
        title:
          "<Robust> +1 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
      {
        title: "Ausgetrockneter Ententümpel",
        description: "Dieser Charakter kann bereite, beschädigte Charaktere herausfordern.",
      },
    ],
  },
  fr: {
    name: "Robotik",
    version: "En costume",
    text: [
      {
        title: "<Résistance> +1",
      },
      {
        title: "Nom d'un circuit intégré",
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
        title: "<Resistere> +1",
      },
      {
        title: "Fanfaluca Ciarlante",
        description: "Questo personaggio può sfidare i personaggi preparati danneggiati.",
      },
    ],
  },
};
