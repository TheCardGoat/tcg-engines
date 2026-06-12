import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const genieMagicalResearcherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Genie",
    version: "Magical Researcher",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "INCREASING WISDOM",
        description: "This character gets +1 {L} for each card under him.",
      },
    ],
  },
  de: {
    name: "Dschinni",
    version: "Magischer Forscher",
    text: [
      {
        title: "Stärken 1",
      },
      {
        title: "WACHSENDE WEISHEIT",
        description: "Dieser Charakter erhält für jede Karte unter ihm +1.",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "Chercheur en magie",
    text: [
      {
        title: "Boost 1",
      },
      {
        title: "SAGESSE CROISSANTE",
        description: "Ce personnage gagne +1 pour chaque carte sous lui.",
      },
    ],
  },
  it: {
    name: "Genio",
    version: "Ricercatore Magico",
    text: [
      {
        title: "Potenziamento 1",
      },
      {
        title: "SAGGEZZA IN AUMENTO",
        description: "Questo personaggio riceve +1 per ogni carta sotto di sé.",
      },
    ],
  },
};
