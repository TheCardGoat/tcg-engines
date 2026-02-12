import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceGrowingGirl: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Support",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "1ao-1",
      name: "GOOD ADVICE Your other",
      text: "GOOD ADVICE Your other characters gain Support.",
      type: "static",
    },
    {
      effect: {
        modifier: 4,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1ao-2",
      text: "WHAT DID I DO? While this character has 10 {S} or more, she gets +4 {L}.",
      type: "static",
    },
  ],
  cardNumber: 160,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "a8457457371219443c6138ae91ffc24bee944433",
  },
  franchise: "Alice in Wonderland",
  fullName: "Alice - Growing Girl",
  id: "1ao",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Alice",
  set: "009",
  strength: 1,
  text: "GOOD ADVICE Your other characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)\nWHAT DID I DO? While this character has 10 {S} or more, she gets +4 {L}.",
  version: "Growing Girl",
  willpower: 4,
};
