import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rozAlwaysWatchingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Roz",
    version: "Always Watching",
    text: [
      {
        title: "Always",
        description: "Each opponent plays with the top card of their deck faceup.",
      },
    ],
  },
  de: {
    name: "Rosa",
    version: "Hat alle im Visier",
    text: [
      {
        title: "Immer",
        description: "Alle gegnerischen Personen spielen mit der obersten Karte ihres Decks offen.",
      },
    ],
  },
  fr: {
    name: "Germaine",
    version: "Toujours à l’œil",
    text: [
      {
        title: "Toujours",
        description: "Chaque adversaire joue avec la carte du dessus de sa pioche face visible.",
      },
    ],
  },
  it: {
    name: "Roz",
    version: "Che Tiene D'Occhio",
    text: [
      {
        title: "Sempre",
        description: "Ogni avversario gioca con la prima carta del suo mazzo a faccia in su.",
      },
    ],
  },
};
