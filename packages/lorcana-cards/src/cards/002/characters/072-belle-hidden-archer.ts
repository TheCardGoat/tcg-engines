import type { CharacterCard } from "@tcg/lorcana-types";

export const belleHiddenArcher: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1gg-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
  ],
  cardNumber: 72,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "bd18d714f4de80dd5f926b8fafd9324dd2543d23",
  },
  franchise: "Beauty and the Beast",
  fullName: "Belle - Hidden Archer",
  id: "1gg",
  inkType: ["emerald"],
  inkable: false,
  lore: 3,
  missingImplementation: true,
  missingTests: true,
  name: "Belle",
  set: "002",
  strength: 3,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Belle.)\nTHORNY ARROWS Whenever this character is challenged, the challenging character's player discards all cards in their hand.",
  version: "Hidden Archer",
  willpower: 3,
};
