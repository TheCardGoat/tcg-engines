import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomLivelySweeper: CharacterCard = {
  id: "t2w",
  cardType: "character",
  name: "Magic Broom",
  version: "Lively Sweeper",
  fullName: "Magic Broom - Lively Sweeper",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "004",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "68cf21bb5125d4c252ea314dbff7d8d817ebccb9",
  },
  classifications: ["Dreamborn", "Broom"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const magicBroomLivelySweeper: LorcanitoCharacterCard = {
//   id: "hxg",
//   name: "Magic Broom",
//   title: "Lively Sweeper",
//   characteristics: ["dreamborn", "broom"],
//   type: "character",
//   flavour: "Clean like nothing happened.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Rudy Hill",
//   number: 49,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550567,
//   },
//   rarity: "common",
// };
//
