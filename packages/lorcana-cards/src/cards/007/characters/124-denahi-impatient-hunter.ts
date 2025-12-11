import type { CharacterCard } from "@tcg/lorcana";

export const denahiImpatientHunter: CharacterCard = {
  id: "8xy",
  cardType: "character",
  name: "Denahi",
  version: "Impatient Hunter",
  fullName: "Denahi - Impatient Hunter",
  inkType: ["ruby", "steel"],
  franchise: "Brother Bear",
  set: "007",
  text: "Reckless (This character can't quest and must challenge each turn if able.)\nResist +2 (Damage dealt to this character is reduced by 2.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 0,
  cardNumber: 124,
  inkable: true,
  externalIds: {
    ravensburger: "203ba2afbe930769d683d5bcc2b361b27d68c85a",
  },
  abilities: [
    {
      id: "8xy-1",
      text: "Reckless",
      type: "keyword",
      keyword: "Reckless",
    },
    {
      id: "8xy-2",
      text: "Resist +2",
      type: "keyword",
      keyword: "Resist",
      value: 2,
    },
  ],
  classifications: ["Storyborn"],
};
