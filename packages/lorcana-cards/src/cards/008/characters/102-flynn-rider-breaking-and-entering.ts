import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderBreakingAndEntering: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "they don't",
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
        type: "conditional",
      },
      id: "o9w-1",
      name: "THIS IS A VERY BIG DAY",
      text: "THIS IS A VERY BIG DAY Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 102,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "577d26f1ad1c747203aca439a701bc0b4705224c",
  },
  franchise: "Tangled",
  fullName: "Flynn Rider - Breaking and Entering",
  id: "o9w",
  inkType: ["emerald"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Flynn Rider",
  set: "008",
  strength: 1,
  text: "THIS IS A VERY BIG DAY Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
  version: "Breaking and Entering",
  willpower: 4,
};
