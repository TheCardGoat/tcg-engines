import type { CharacterCard } from "@tcg/lorcana-types";

export const nibsLostBoy: CharacterCard = {
  abilities: [
    {
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      id: "1ar-1",
      name: "LOOK WHO'S BACK",
      text: "LOOK WHO'S BACK When this character is banished in a challenge, return this card to your hand.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 48,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "a88d8cf7ffba8d2838430c343d109ca60f006c2b",
  },
  franchise: "Peter Pan",
  fullName: "Nibs - Lost Boy",
  id: "1ar",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Nibs",
  set: "010",
  strength: 3,
  text: "LOOK WHO'S BACK When this character is banished in a challenge, return this card to your hand.",
  version: "Lost Boy",
  willpower: 3,
};
