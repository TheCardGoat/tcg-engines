import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchAlienDancer: CharacterCard = {
  id: "10i",
  cardType: "character",
  name: "Stitch",
  version: "Alien Dancer",
  fullName: "Stitch - Alien Dancer",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "009",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 9,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "839f4d00a9e24a4cc3b359aad468d464b798d869",
  },
  classifications: ["Storyborn", "Hero", "Alien"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { stitchAlienDancer as ogStitchAlienDancer } from "@lorcanito/lorcana-engine/cards/004/characters/23-stitch-alien-dancer";
//
// export const stitchAlienDancer: LorcanitoCharacterCard = {
//   ...ogStitchAlienDancer,
//   id: "g0k",
//   reprints: [ogStitchAlienDancer.id],
//   number: 9,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649958,
//   },
// };
//
