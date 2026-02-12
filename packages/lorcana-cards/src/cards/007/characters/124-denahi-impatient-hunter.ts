import type { CharacterCard } from "@tcg/lorcana-types";

export const denahiImpatientHunter: CharacterCard = {
  abilities: [
    {
      id: "8xy-1",
      keyword: "Reckless",
      text: "Reckless",
      type: "keyword",
    },
    {
      id: "8xy-2",
      keyword: "Resist",
      text: "Resist +2",
      type: "keyword",
      value: 2,
    },
  ],
  cardNumber: 124,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 3,
  externalIds: {
    ravensburger: "203ba2afbe930769d683d5bcc2b361b27d68c85a",
  },
  franchise: "Brother Bear",
  fullName: "Denahi - Impatient Hunter",
  id: "8xy",
  inkType: ["ruby", "steel"],
  inkable: true,
  lore: 0,
  name: "Denahi",
  set: "007",
  strength: 3,
  text: "Reckless (This character can't quest and must challenge each turn if able.)\nResist +2 (Damage dealt to this character is reduced by 2.)",
  version: "Impatient Hunter",
  willpower: 2,
};
