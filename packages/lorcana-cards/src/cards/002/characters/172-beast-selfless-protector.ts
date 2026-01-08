import type { CharacterCard } from "@tcg/lorcana-types";

export const beastSelflessProtector: CharacterCard = {
  id: "10d",
  cardType: "character",
  name: "Beast",
  version: "Selfless Protector",
  fullName: "Beast - Selfless Protector",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "SHIELD ANOTHER Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.",
  cost: 6,
  strength: 2,
  willpower: 8,
  lore: 1,
  cardNumber: 172,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "830ffeb31b5a7249acb3caaea8f3ca1a89ebbf0b",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { protectorAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const beastSelflessProtector: LorcanitoCharacterCard = {
//   id: "njt",
//
//   name: "Beast",
//   title: "Selfless Protector",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**SHIELD ANOTHER** Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.",
//   type: "character",
//   abilities: [
//     {
//       ...protectorAbility,
//       name: "Shield Another",
//       text: "Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.",
//     },
//   ],
//   flavour: "You'll have to go through me first.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 2,
//   willpower: 8,
//   lore: 1,
//   illustrator: "Matthew Robert Davies",
//   number: 172,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527772,
//   },
//   rarity: "super_rare",
// };
//
