import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderBreakingAndEntering: CharacterCard = {
  id: "o9w",
  cardType: "character",
  name: "Flynn Rider",
  version: "Breaking and Entering",
  fullName: "Flynn Rider - Breaking and Entering",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "008",
  text: "THIS IS A VERY BIG DAY Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 3,
  cardNumber: 102,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "577d26f1ad1c747203aca439a701bc0b4705224c",
  },
  abilities: [
    {
      id: "o9w-1",
      type: "triggered",
      name: "THIS IS A VERY BIG DAY",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "they don't",
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
      },
      text: "THIS IS A VERY BIG DAY Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
