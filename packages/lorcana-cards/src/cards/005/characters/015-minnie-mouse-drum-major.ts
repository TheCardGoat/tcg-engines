import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseDrumMajor: CharacterCard = {
  id: "o0p",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Drum Major",
  fullName: "Minnie Mouse - Drum Major",
  inkType: ["amber"],
  set: "005",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Minnie Mouse.)\nPARADE ORDER When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 15,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5691a241218d73c335bda2e1619d1160eff5e117",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};
