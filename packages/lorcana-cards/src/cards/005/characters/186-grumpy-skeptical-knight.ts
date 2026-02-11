import type { CharacterCard } from "@tcg/lorcana-types";

export const grumpySkepticalKnight: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 2,
      },
      id: "pqh-1",
      text: "BOON OF RESILIENCE While one of your Knight characters is at a location, that character gains Resist +2.",
      type: "action",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      id: "pqh-2",
      text: "BURST OF SPEED During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 186,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  cost: 3,
  externalIds: {
    ravensburger: "5cc0f712cdf1add499e1fd33c027af155c88d367",
  },
  franchise: "Snow White",
  fullName: "Grumpy - Skeptical Knight",
  id: "pqh",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Grumpy",
  set: "005",
  strength: 3,
  text: "BOON OF RESILIENCE While one of your Knight characters is at a location, that character gains Resist +2. (Damage dealt to them is reduced by 2.)\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Skeptical Knight",
  willpower: 1,
};
