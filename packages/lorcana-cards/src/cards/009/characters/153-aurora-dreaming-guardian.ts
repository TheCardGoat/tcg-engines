import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraDreamingGuardian: CharacterCard = {
  id: "11z",
  cardType: "character",
  name: "Aurora",
  version: "Dreaming Guardian",
  fullName: "Aurora - Dreaming Guardian",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Aurora.)\nPROTECTIVE EMBRACE Your other characters gain Ward. (Opponents can't choose them except to challenge.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 153,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "88f3b49fc2874d9eb1cb392887fe8c005c52bba9",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { auroraDreamingGuardian as ogAuroraDreamingGuardian } from "@lorcanito/lorcana-engine/cards/001/characters/139-aurora-dreaming-guardian";
//
// export const auroraDreamingGuardian: LorcanitoCharacterCard = {
//   ...ogAuroraDreamingGuardian,
//   id: "kjf",
//   reprints: ["wb5"],
//   number: 153,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650088,
//   },
// };
//
