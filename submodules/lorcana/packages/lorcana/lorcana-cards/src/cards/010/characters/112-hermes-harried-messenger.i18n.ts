import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hermesHarriedMessengerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hermes",
    version: "Harried Messenger",
    text: "Rush",
  },
  de: {
    name: "Hermes",
    version: "Gestresster Bote",
    text: "Rasant",
  },
  fr: {
    name: "Hermès",
    version: "Messager pressé",
    text: "Charge",
  },
  it: {
    name: "Hermes",
    version: "Messaggero Stressato",
    text: [
      {
        title: "Lesto",
        description: "(Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
    ],
  },
};
