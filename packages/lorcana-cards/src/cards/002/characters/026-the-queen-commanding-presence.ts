import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenCommandingPresence: CharacterCard = {
  id: "5hw",
  cardType: "character",
  name: "The Queen",
  version: "Commanding Presence",
  fullName: "The Queen - Commanding Presence",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named The Queen.)\nWHO IS THE FAIREST? Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 26,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "13cfc5ee51d21b9da1620a64f0c80751cd3ffc82",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "Queen"],
};
