import type { CharacterCard } from "@tcg/lorcana-types";

export const belleHiddenArcher: CharacterCard = {
  id: "1gg",
  cardType: "character",
  name: "Belle",
  version: "Hidden Archer",
  fullName: "Belle - Hidden Archer",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Belle.)\nTHORNY ARROWS Whenever this character is challenged, the challenging character's player discards all cards in their hand.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 3,
  cardNumber: 72,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bd18d714f4de80dd5f926b8fafd9324dd2543d23",
  },
  abilities: [
    {
      id: "1gg-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
};
