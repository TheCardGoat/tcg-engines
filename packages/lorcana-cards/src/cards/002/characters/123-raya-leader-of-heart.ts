import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaLeaderOfHeart: CharacterCard = {
  id: "m5o",
  cardType: "character",
  name: "Raya",
  version: "Leader of Heart",
  fullName: "Raya - Leader of Heart",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Raya.)\nCHAMPION OF KUMANDRA Whenever this character challenges a damaged character, she takes no damage from the challenge.",
  cost: 6,
  strength: 5,
  willpower: 3,
  lore: 2,
  cardNumber: 123,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4fdb59ae1c0d5735b0e7fdd135a4f2e4181b4f96",
  },
  abilities: [
    {
      id: "m5o-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
};
