import type { CharacterCard } from "@tcg/lorcana-types";

export const nalaUndauntedLioness: CharacterCard = {
  abilities: [
    {
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
      id: "1xs-1",
      text: "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1.",
      type: "static",
    },
  ],
  cardNumber: 173,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "fb7ea808456214e200b4637c8b19a6e87955731f",
  },
  franchise: "Lion King",
  fullName: "Nala - Undaunted Lioness",
  id: "1xs",
  inkType: ["steel"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Nala",
  set: "009",
  strength: 0,
  text: "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)",
  version: "Undaunted Lioness",
  willpower: 2,
};
