import type { CharacterCard } from "@tcg/lorcana-types";

export const hiroHamadaFutureChampion: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "syk-1",
      name: "ORIGIN STORY",
      text: "ORIGIN STORY When you play a Floodborn character on this card, draw a card.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 90,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Inventor"],
  cost: 3,
  externalIds: {
    ravensburger: "686034d962f46489c63777e2863fb97e064b033a",
  },
  franchise: "Big Hero 6",
  fullName: "Hiro Hamada - Future Champion",
  id: "syk",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  name: "Hiro Hamada",
  set: "007",
  strength: 3,
  text: "ORIGIN STORY When you play a Floodborn character on this card, draw a card.",
  version: "Future Champion",
  willpower: 3,
};
