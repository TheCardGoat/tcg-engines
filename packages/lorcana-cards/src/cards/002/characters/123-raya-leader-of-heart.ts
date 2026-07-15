import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaLeaderOfHeart: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "m5o-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
  ],
  cardNumber: 123,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 6,
  externalIds: {
    ravensburger: "4fdb59ae1c0d5735b0e7fdd135a4f2e4181b4f96",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Raya - Leader of Heart",
  id: "m5o",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Raya",
  set: "002",
  strength: 5,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Raya.)\nCHAMPION OF KUMANDRA Whenever this character challenges a damaged character, she takes no damage from the challenge.",
  version: "Leader of Heart",
  willpower: 3,
};
