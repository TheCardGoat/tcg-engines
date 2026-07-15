import type { CharacterCard } from "@tcg/lorcana-types";

export const stabbingtonBrotherWithAPatch: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: "OPPONENT",
        type: "lose-lore",
      },
      id: "y6f-1",
      name: "CRIME OF OPPORTUNITY",
      text: "CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 128,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "036bf4522b52312d577ea5211b54cebf7979ed09",
  },
  franchise: "Tangled",
  fullName: "Stabbington Brother - With a Patch",
  id: "y6f",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Stabbington Brother",
  set: "007",
  strength: 4,
  text: "CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.",
  version: "With a Patch",
  willpower: 4,
};
