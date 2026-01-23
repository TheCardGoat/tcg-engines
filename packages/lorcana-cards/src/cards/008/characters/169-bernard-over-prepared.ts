import type { CharacterCard } from "@tcg/lorcana-types";

export const bernardOverprepared: CharacterCard = {
  id: "wn2",
  cardType: "character",
  name: "Bernard",
  version: "Over-Prepared",
  fullName: "Bernard - Over-Prepared",
  inkType: ["sapphire", "steel"],
  franchise: "Rescuers",
  set: "008",
  text: "GO DOWN THERE AND INVESTIGATE When you play this character, if you have an Ally character in play, you may draw a card.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 169,
  inkable: false,
  externalIds: {
    ravensburger: "75a38e9bf91e99d60dc0c4257bda349a11ad414d",
  },
  abilities: [
    {
      id: "wn2-1",
      type: "triggered",
      name: "GO DOWN THERE AND INVESTIGATE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have an Ally character in play",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "GO DOWN THERE AND INVESTIGATE When you play this character, if you have an Ally character in play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
