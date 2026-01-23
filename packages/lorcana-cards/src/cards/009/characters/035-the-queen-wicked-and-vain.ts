import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenWickedAndVain: CharacterCard = {
  id: "2kk",
  cardType: "character",
  name: "The Queen",
  version: "Wicked and Vain",
  fullName: "The Queen - Wicked and Vain",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "009",
  text: "I SUMMON THEE {E} — Draw a card.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 35,
  inkable: true,
  externalIds: {
    ravensburger: "094496e1f92348975aa93f49b2bb514555b8d8d7",
  },
  abilities: [
    {
      id: "2kk-1",
      type: "activated",
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "I SUMMON THEE {E} — Draw a card.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
};
