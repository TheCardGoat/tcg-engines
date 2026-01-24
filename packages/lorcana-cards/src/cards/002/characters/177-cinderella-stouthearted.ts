import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaStouthearted: CharacterCard = {
  id: "h1c",
  cardType: "character",
  name: "Cinderella",
  version: "Stouthearted",
  fullName: "Cinderella - Stouthearted",
  inkType: ["steel"],
  franchise: "Cinderella",
  set: "002",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cinderella.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nTHE SINGING SWORD Whenever you play a song, this character may challenge ready characters this turn.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  cardNumber: 177,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3d67840e2611347a4132ec418a46982679ab9939",
  },
  abilities: [
    {
      id: "h1c-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "h1c-2",
      type: "keyword",
      keyword: "Resist",
      value: 2,
      text: "Resist +2",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Knight"],
};
