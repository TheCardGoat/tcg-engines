import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsHaughtyMonarch: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 3,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1dq-1",
      text: "COUNT OFF! While there are 5 or more characters with damage in play, this character gets +3 {L}.",
      type: "action",
    },
  ],
  cardNumber: 105,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Queen"],
  cost: 4,
  externalIds: {
    ravensburger: "b347cdaf0ef46c30b3701852557d77f69853cee3",
  },
  franchise: "Alice in Wonderland",
  fullName: "Queen of Hearts - Haughty Monarch",
  id: "1dq",
  inkType: ["emerald", "ruby"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Queen of Hearts",
  set: "008",
  strength: 2,
  text: "COUNT OFF! While there are 5 or more characters with damage in play, this character gets +3 {L}.",
  version: "Haughty Monarch",
  willpower: 3,
};
