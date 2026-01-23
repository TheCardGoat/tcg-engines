import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodCapableFighter: CharacterCard = {
  id: "qi2",
  cardType: "character",
  name: "Robin Hood",
  version: "Capable Fighter",
  fullName: "Robin Hood - Capable Fighter",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "009",
  text: "SKIRMISH {E} — Deal 1 damage to chosen character.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 184,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5f83698b937b20863589246dc016340a7d70828f",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { robinHoodCapableFighter as ogRobinHoodCapableFighter } from "@lorcanito/lorcana-engine/cards/002/characters/193-robin-hood-capable-fighter";
//
// export const robinHoodCapableFighter: LorcanitoCharacterCard = {
//   ...ogRobinHoodCapableFighter,
//   id: "kjo",
//   reprints: [ogRobinHoodCapableFighter.id],
//   number: 184,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650117,
//   },
// };
//
