import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaStouthearted: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "h1c-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      id: "h1c-2",
      keyword: "Resist",
      text: "Resist +2",
      type: "keyword",
      value: 2,
    },
  ],
  cardNumber: 177,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess", "Knight"],
  cost: 7,
  externalIds: {
    ravensburger: "3d67840e2611347a4132ec418a46982679ab9939",
  },
  franchise: "Cinderella",
  fullName: "Cinderella - Stouthearted",
  id: "h1c",
  inkType: ["steel"],
  inkable: true,
  lore: 3,
  missingImplementation: true,
  missingTests: true,
  name: "Cinderella",
  set: "002",
  strength: 5,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cinderella.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nTHE SINGING SWORD Whenever you play a song, this character may challenge ready characters this turn.",
  version: "Stouthearted",
  willpower: 5,
};
