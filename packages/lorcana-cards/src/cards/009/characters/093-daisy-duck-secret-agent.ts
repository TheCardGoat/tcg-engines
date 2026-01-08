import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckSecretAgent: CharacterCard = {
  id: "1wn",
  cardType: "character",
  name: "Daisy Duck",
  version: "Secret Agent",
  fullName: "Daisy Duck - Secret Agent",
  inkType: ["emerald"],
  set: "009",
  text: "THWART Whenever this character quests, each opponent chooses and discards a card.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 93,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f7619092cc3f72796ad99666c3375f2c35ba256f",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { daisyDuckSecretAgent as daisyDuckSecretAgentAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/076-daisy-duck-secret-agent";
//
// export const daisyDuckSecretAgent: LorcanitoCharacterCard = {
//   ...daisyDuckSecretAgentAsOrig,
//   id: "pqa",
//   reprints: [daisyDuckSecretAgentAsOrig.id],
//   number: 93,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650032,
//   },
// };
//
