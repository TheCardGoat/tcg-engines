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
        title: "Frische Tinte",
        description: "Wenn du diesen Gegenstand ausspielst, ziehe 1 Karte.",
      },
      {
        title: "Unerwarteter Fund",
        description:
          "Behandle jede deiner Handkarten so, als würde sie {C} um das Kosten-Sechseck zeigen.",
      },
    ],
  },
  fr: {
    name: "Invocateur d'encre caché",
    text: [
      {
        title: "Encre fraîche",
        description: "Lorsque vous jouez cet objet, piochez une carte.",
      },
      {
        title: "Trésor inespéré",
        description: "Toutes les cartes de votre main sont considérées comme ayant {C}.",
      },
    ],
  },
  it: {
    name: "Inchiostratore Celato",
    text: [
      {
        title: "Inchiostro Fresco",
        description: "Quando giochi questo oggetto, pesca una carta.",
      },
      {
        title: "Tesoro Inaspettato",
        description: "Tutte le carte nella tua mano contano come se avessero {C}.",
      },
    ],
  },
};
