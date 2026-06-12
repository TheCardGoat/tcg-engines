import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chifuImperialAdvisorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chi-Fu",
    version: "Imperial Advisor",
    text: [
      {
        title: "OVERLY CAUTIOUS",
        description: "While this character has no damage, he gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Chi-Fu",
    version: "Berater des Kaisers",
    text: [
      {
        title: "ÜBERVORSICHTIG",
        description: "Solange dieser Charakter unbeschädigt ist, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Chi Fu",
    version: "Conseiller Impérial",
    text: [
      {
        title: "EXCESSIVEMENT PRUDENT",
        description: "Tant que ce personnage n'a aucun jeton Dommage sur lui, il gagne +2.",
      },
    ],
  },
  it: {
    name: "Chi Fu",
    version: "Consigliere Imperiale",
    text: [
      {
        title: "ESTREMAMENTE CAUTO",
        description: "Mentre questo personaggio non ha danno, riceve +2.",
      },
    ],
  },
};
