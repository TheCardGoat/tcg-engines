import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hiddenInkcasterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hidden Inkcaster",
    text: [
      {
        title: "FRESH INK",
        description: "When you play this item, draw a card.",
      },
      {
        title: "UNEXPECTED TREASURE",
        description: "All cards in your hand count as having {IW}.",
      },
    ],
  },
  de: {
    name: "Verborgener Tintenformer",
    text: [
      {
        title: "FRISCHE TINTE",
        description: "Wenn du diesen Gegenstand ausspielst, ziehe 1 Karte.",
      },
      {
        title: "UNERWARTETER FUND",
        description:
          "Behandle jede deiner Handkarten so, als würde sie um das Kosten-Sechseck zeigen.",
      },
    ],
  },
  fr: {
    name: "Invocateur d'encre caché",
    text: [
      {
        title: "ENCRE FRAÎCHE",
        description: "Lorsque vous jouez cet objet, piochez une carte.",
      },
      {
        title: "TRÉSOR INESPÉRÉ",
        description: "Toutes les cartes de votre main sont considérées comme ayant.",
      },
    ],
  },
  it: {
    name: "Inchiostratore Celato",
    text: [
      {
        title: "INCHIOSTRO FRESCO",
        description: "Quando giochi questo oggetto, pesca una carta.",
      },
      {
        title: "TESORO INASPETTATO",
        description: "Tutte le carte nella tua mano contano come se avessero.",
      },
    ],
  },
};
