import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinCompletingHisResearchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin",
    version: "Completing His Research",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "LEGACY OF LEARNING",
        description:
          "When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
      },
    ],
  },
  de: {
    name: "Merlin",
    version: "Vollendet seine Forschung",
    text: [
      {
        title: "Stärken 2",
      },
      {
        title: "ERBE DES LERNENS",
        description:
          "Wenn dieser Charakter durch eine Herausforderung verbannt wird, falls er mindestens eine Karte unter sich hatte, ziehe 2 Karten.",
      },
    ],
  },
  fr: {
    name: "Merlin",
    version: "Terminant ses recherches",
    text: [
      {
        title: "Boost 2",
      },
      {
        title: "HÉRITAGE DE CONNAISSANCES",
        description:
          "Lorsque ce personnage est banni via un défi, s'il y avait une carte sous lui, piochez 2 cartes.",
      },
    ],
  },
  it: {
    name: "Merlino",
    version: "Che Completa le Sue Ricerche",
    text: [
      {
        title: "Potenziamento 2",
      },
      {
        title: "L'EREDITÀ DELL'ERUDITO",
        description:
          "Quando questo personaggio viene esiliato in una sfida, se aveva una carta sotto di sé, pesca 2 carte.",
      },
    ],
  },
};
