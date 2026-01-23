import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelSunshine: CharacterCard = {
  id: "zai",
  cardType: "character",
  name: "Rapunzel",
  version: "Sunshine",
  fullName: "Rapunzel - Sunshine",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "009",
  text: "MAGIC HAIR {E} — Remove up to 2 damage from chosen character.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 8,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7f320853572087cd1fb899a7ceb5a7132c41758c",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rapunzelSunshine as ogRapunzelSunshine } from "@lorcanito/lorcana-engine/cards/002/characters/020-rapunzel-sunshine";
//
// export const rapunzelSunshine: LorcanitoCharacterCard = {
//   ...ogRapunzelSunshine,
//   id: "p6p",
//   reprints: [ogRapunzelSunshine.id],
//   number: 8,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649957,
//   },
// };
//
