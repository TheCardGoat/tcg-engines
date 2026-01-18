import type { CharacterCard } from "@tcg/lorcana-types";
import { singer } from "../../ability-helpers";

export const sebastianCourtComposer: CharacterCard = {
  id: "8rz",
  cardType: "character",
  name: "Sebastian",
  version: "Court Composer",
  fullName: "Sebastian - Court Composer",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  text: "Singer 4 (This character counts as cost 4 to sing songs.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 19,
  inkable: true,
  externalIds: {
    ravensburger: "1fa28a7f4b2398c8cc72ea121b01ac0cccdda582",
  },
  abilities: [singer("8rz-1", 4)],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { SingerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const sebastianCourtComposer: LorcanitoCharacterCard = {
//   id: "pj3",
//
//   name: "Sebastian",
//   title: "Court Composer",
//   characteristics: ["storyborn", "ally"],
//   text: "**Singer** 4 _(This character counts as cost 4 to sing songs.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "singer",
//       value: 4,
//       text: "**Singer** 4 _(This character counts as cost 4 to sing songs.)_",
//     } as SingerAbility,
//   ],
//   flavour:
//     "I should be writing symphonies, not tagging along after some headstrong teenager.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Isaiah Mesq",
//   number: 19,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 504540,
//   },
//   rarity: "common",
// };
//
