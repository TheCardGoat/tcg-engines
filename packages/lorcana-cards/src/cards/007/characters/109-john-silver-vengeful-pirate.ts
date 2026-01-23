import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverVengefulPirate: CharacterCard = {
  id: "1p4",
  cardType: "character",
  name: "John Silver",
  version: "Vengeful Pirate",
  fullName: "John Silver - Vengeful Pirate",
  inkType: ["emerald", "steel"],
  franchise: "Treasure Planet",
  set: "007",
  text: "DRAWN TO A FIGHT If an opposing character was damaged this turn, you pay 2 {I} less to play this character.\nResist +1 (Damage dealt to this character is reduced by 1.)\nI AIN'T GONE SOFT! Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
  cost: 8,
  strength: 6,
  willpower: 4,
  lore: 2,
  cardNumber: 109,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dc584065fcb4cd49d186951d0d6d794fd2de71a4",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
};
