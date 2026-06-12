import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const heartOfTeFitiI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Heart of Te Fiti",
    text: [
      {
        title: "CREATE LIFE",
        description:
          "{E}, 2 {I} — Put the top card of your deck into your inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Herz von Te Fiti",
    text: [
      {
        title: "LEBEN ERSCHAFFEN, 2",
        description:
          "— Lege die oberste Karte deines Decks verdeckt und erschöpft in deinen Tintenvorrat.",
      },
    ],
  },
  fr: {
    name: "Le cœur de Te Fiti",
    text: [
      {
        title: "ENGENDRER LA VIE, 2",
        description:
          "— Placez la première carte de votre pioche dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "Cuore di Te Fiti",
    text: [
      {
        title: "CREARE LA VITA, 2",
        description:
          "— Aggiungi la prima carta del tuo mazzo al tuo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
};
