import type { CharacterCard } from "@tcg/lorcana-types";

export const mufasaAmongTheStars: CharacterCard = {
  id: "1c7",
  cardType: "character",
  name: "Mufasa",
  version: "Among the Stars",
  fullName: "Mufasa - Among the Stars",
  inkType: ["amethyst", "steel"],
  franchise: "Lion King",
  set: "007",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mufasa.)\nEvasive (Only characters with Evasive can challenge this character.)\nResist +1 (Damage dealt to this character is reduced by 1.)",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 2,
  cardNumber: 79,
  inkable: true,
  externalIds: {
    ravensburger: "adcb1daa41ea7803f3fe66ab407a12ff728ac741",
  },
  abilities: [
    {
      id: "1c7-1",
      text: "Shift",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
    },
    {
      id: "1c7-2",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "1c7-3",
      text: "Resist +1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
    },
  ],
  classifications: ["Floodborn", "Mentor", "King"],
};
