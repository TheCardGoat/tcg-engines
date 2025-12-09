import type { CharacterCard } from "@tcg/lorcana";

export const hiroHamadaFutureChampion: CharacterCard = {
  id: "syk",
  cardType: "character",
  name: "Hiro Hamada",
  version: "Future Champion",
  fullName: "Hiro Hamada - Future Champion",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "007",
  text: "ORIGIN STORY When you play a Floodborn character on this card, draw a card.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 90,
  inkable: true,
  externalIds: {
    ravensburger: "686034d962f46489c63777e2863fb97e064b033a",
  },
  abilities: [
    {
      id: "syk-1",
      text: "ORIGIN STORY When you play a Floodborn character on this card, draw a card.",
      type: "triggered",
      name: "ORIGIN STORY",
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
};
