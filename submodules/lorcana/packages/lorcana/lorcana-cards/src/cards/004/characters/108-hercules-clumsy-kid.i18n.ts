import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const herculesClumsyKidI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hercules",
    version: "Clumsy Kid",
    text: "Rush",
  },
  de: {
    name: "Hercules",
    version: "Tollpatschiges Kind",
    text: "Rasant",
  },
  fr: {
    name: "Hercule",
    version: "Gamin maladroit",
    text: "Charge",
  },
  it: {
    name: "Ercole",
    version: "Ragazzino Impacciato",
    text: [
      {
        title: "Lesto",
        description: "(Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
    ],
  },
};
