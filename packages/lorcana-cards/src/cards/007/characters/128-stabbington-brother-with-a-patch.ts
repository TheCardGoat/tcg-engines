import type { CharacterCard } from "@tcg/lorcana-types";

export const stabbingtonBrotherWithAPatch: CharacterCard = {
  id: "y6f",
  cardType: "character",
  name: "Stabbington Brother",
  version: "With a Patch",
  fullName: "Stabbington Brother - With a Patch",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "007",
  text: "CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 128,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "036bf4522b52312d577ea5211b54cebf7979ed09",
  },
  abilities: [
    {
      id: "y6f-1",
      type: "triggered",
      name: "CRIME OF OPPORTUNITY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "OPPONENT",
      },
      text: "CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
