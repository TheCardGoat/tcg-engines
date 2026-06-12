import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kakamoraBoardingPartyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kakamora",
    version: "Boarding Party",
    text: "Rush",
  },
  de: {
    name: "Kokomora",
    version: "Entermannschaft",
    text: "Rasant",
  },
  fr: {
    name: "Kakamora",
    version: "Groupe d'abordage",
    text: "Charge",
  },
  it: {
    name: "Kakamora",
    version: "Banda d'Arrembaggio",
    text: [
      {
        title: "Lesto",
        description: "(Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
    ],
  },
};
