import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceGrowingGirl: CharacterCard = {
  id: "1ao",
  cardType: "character",
  name: "Alice",
  version: "Growing Girl",
  fullName: "Alice - Growing Girl",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "009",
  text: "GOOD ADVICE Your other characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)\nWHAT DID I DO? While this character has 10 {S} or more, she gets +4 {L}.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 160,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a8457457371219443c6138ae91ffc24bee944433",
  },
  abilities: [
    {
      id: "1ao-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "YOUR_CHARACTERS",
      },
      name: "GOOD ADVICE Your other",
      text: "GOOD ADVICE Your other characters gain Support.",
    },
    {
      id: "1ao-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 4,
        target: "SELF",
      },
      text: "WHAT DID I DO? While this character has 10 {S} or more, she gets +4 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
