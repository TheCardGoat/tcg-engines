import type { CharacterCard } from "@tcg/lorcana-types";
import { challenger } from "../../ability-helpers";

export const drFacilierCharlatan: CharacterCard = {
  id: "8u0",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Charlatan",
  fullName: "Dr. Facilier - Charlatan",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "001",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 38,
  inkable: true,
  externalIds: {
    ravensburger: "1fd605fe2fe7ee5b8de1e22cc92998c2f04e0304",
  },
  abilities: [challenger("8u0-1", 2)],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ChallengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const drFacilierCharlatan: LorcanitoCharacterCard = {
//   id: "fov",
//
//   name: "Dr. Facilier",
//   title: "Charlatan",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
//   type: "character",
//   strength: 0,
//   abilities: [
//     {
//       type: "static",
//       ability: "challenger",
//       value: 2,
//       text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
//     } as ChallengerAbility,
//   ],
//   flavour: "Enchantée. A tip of the hat from Dr. Facilier.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Grace Tran",
//   number: 38,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 494099,
//   },
//   rarity: "common",
// };
//
