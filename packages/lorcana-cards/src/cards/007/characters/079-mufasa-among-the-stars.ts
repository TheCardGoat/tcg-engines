import type { CharacterCard } from "@tcg/lorcana-types";

export const mufasaAmongTheStars: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1c7-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      id: "1c7-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      id: "1c7-3",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
  ],
  cardNumber: 79,
  cardType: "character",
  classifications: ["Floodborn", "Mentor", "King"],
  cost: 7,
  externalIds: {
    ravensburger: "adcb1daa41ea7803f3fe66ab407a12ff728ac741",
  },
  franchise: "Lion King",
  fullName: "Mufasa - Among the Stars",
  id: "1c7",
  inkType: ["amethyst", "steel"],
  inkable: true,
  lore: 2,
  name: "Mufasa",
  set: "007",
  strength: 5,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mufasa.)\nEvasive (Only characters with Evasive can challenge this character.)\nResist +1 (Damage dealt to this character is reduced by 1.)",
  version: "Among the Stars",
  willpower: 7,
};
