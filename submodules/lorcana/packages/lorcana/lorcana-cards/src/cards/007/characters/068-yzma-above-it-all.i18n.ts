import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const yzmaAboveItAllI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Yzma",
    version: "Above It All",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Evasive",
      },
      {
        title: "BACK TO WORK",
        description:
          "Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.",
      },
    ],
  },
  de: {
    name: "Isma",
    version: "Steht über allem",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "Wendig",
      },
      {
        title: "ZURÜCK AN DIE ARBEIT",
        description:
          "Jedes Mal, wenn ein anderer Charakter durch eine Herausforderung verbannt wird, nimmt die zugehörige Person ihn auf ihre Hand zurück und wirft danach eine zufällig ausgewählte Karte von ihrer Hand ab.",
      },
    ],
  },
  fr: {
    name: "Yzma",
    version: "Au-dessus de tout",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "Insaisissable",
      },
      {
        title: "AU BOULOT",
        description:
          "Chaque fois qu'un autre personnage est banni via un défi, renvoyez-le dans la main de son propriétaire, puis ce joueur se défausse d'une carte au hasard.",
      },
    ],
  },
  it: {
    name: "Yzma",
    version: "Al di Sopra di Ogni Cosa",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "Sfuggente",
      },
      {
        title: "AL LAVORO",
        description:
          "Ogni volta che un altro personaggio viene esiliato in una sfida, fai riprendere in mano al suo giocatore quella carta, poi quel giocatore scarta una carta a caso.",
      },
    ],
  },
};
