import type { CharacterCard } from "@tcg/lorcana-types";

export const bernardOverprepared: CharacterCard = {
  abilities: [
    {
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
      id: "wn2-1",
      name: "GO DOWN THERE AND INVESTIGATE",
      text: "GO DOWN THERE AND INVESTIGATE When you play this character, if you have an Ally character in play, you may draw a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 169,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "75a38e9bf91e99d60dc0c4257bda349a11ad414d",
  },
  franchise: "Rescuers",
  fullName: "Bernard - Over-Prepared",
  id: "wn2",
  inkType: ["sapphire", "steel"],
  inkable: false,
  lore: 1,
  name: "Bernard",
  set: "008",
  strength: 2,
  text: "GO DOWN THERE AND INVESTIGATE When you play this character, if you have an Ally character in play, you may draw a card.",
  version: "Over-Prepared",
  willpower: 2,
};
