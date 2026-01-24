import type { CharacterCard } from "@tcg/lorcana-types";

export const nibsLostBoy: CharacterCard = {
  id: "1ar",
  cardType: "character",
  name: "Nibs",
  version: "Lost Boy",
  fullName: "Nibs - Lost Boy",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "010",
  text: "LOOK WHO'S BACK When this character is banished in a challenge, return this card to your hand.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 48,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a88d8cf7ffba8d2838430c343d109ca60f006c2b",
  },
  abilities: [
    {
      id: "1ar-1",
      type: "triggered",
      name: "LOOK WHO'S BACK",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      text: "LOOK WHO'S BACK When this character is banished in a challenge, return this card to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
