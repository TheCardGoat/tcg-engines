import type { CharacterCard } from "@tcg/lorcana-types";

export const nalaUndauntedLioness: CharacterCard = {
  id: "1xs",
  cardType: "character",
  name: "Nala",
  version: "Undaunted Lioness",
  fullName: "Nala - Undaunted Lioness",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "009",
  text: "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 2,
  cardNumber: 173,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "fb7ea808456214e200b4637c8b19a6e87955731f",
  },
  abilities: [
    {
      id: "1xs-1",
      type: "static",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            target: "SELF",
          },
          {
            type: "gain-keyword",
            keyword: "Resist",
            target: "SELF",
            value: 1,
          },
        ],
      },
      text: "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
