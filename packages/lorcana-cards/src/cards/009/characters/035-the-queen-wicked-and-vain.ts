import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenWickedAndVain: CharacterCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "2kk-1",
      text: "I SUMMON THEE {E} — Draw a card.",
      type: "activated",
    },
  ],
  cardNumber: 35,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Queen"],
  cost: 5,
  externalIds: {
    ravensburger: "094496e1f92348975aa93f49b2bb514555b8d8d7",
  },
  franchise: "Snow White",
  fullName: "The Queen - Wicked and Vain",
  id: "2kk",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "The Queen",
  set: "009",
  strength: 4,
  text: "I SUMMON THEE {E} — Draw a card.",
  version: "Wicked and Vain",
  willpower: 5,
};
