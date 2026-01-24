import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsHaughtyMonarch: CharacterCard = {
  id: "1dq",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Haughty Monarch",
  fullName: "Queen of Hearts - Haughty Monarch",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "008",
  text: "COUNT OFF! While there are 5 or more characters with damage in play, this character gets +3 {L}.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 3,
  cardNumber: 105,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b347cdaf0ef46c30b3701852557d77f69853cee3",
  },
  abilities: [
    {
      id: "1dq-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 3,
        target: "SELF",
      },
      text: "COUNT OFF! While there are 5 or more characters with damage in play, this character gets +3 {L}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
};
