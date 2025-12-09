import type { CharacterCard } from "@tcg/lorcana";

export const mulanSoldierInTraining: CharacterCard = {
  id: "x7m",
  cardType: "character",
  name: "Mulan",
  version: "Soldier in Training",
  fullName: "Mulan - Soldier in Training",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "002",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 117,
  inkable: false,
  externalIds: {
    ravensburger: "77b270ef01a1671fcf0123fc2f0dceb294777022",
  },
  keywords: ["Rush"],
  abilities: [
    {
      id: "x7m-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
