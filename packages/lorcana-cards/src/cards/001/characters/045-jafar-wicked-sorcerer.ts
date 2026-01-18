import type { CharacterCard } from "@tcg/lorcana-types";
import { challenger } from "../../ability-helpers";

export const jafarWickedSorcerer: CharacterCard = {
  id: "1dn",
  cardType: "character",
  name: "Jafar",
  version: "Wicked Sorcerer",
  fullName: "Jafar - Wicked Sorcerer",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "001",
  text: "Challenger +3 (While challenging, this character gets +3 {S}.)",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 45,
  inkable: true,
  externalIds: {
    ravensburger: "b3001090c82926f995dda5332ff5f0546257b061",
  },
  abilities: [challenger("1dn-1", 3)],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ChallengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const jafarWicked: LorcanitoCharacterCard = {
//   id: "fh0",
//   name: "Jafar",
//   title: "Wicked Sorcerer",
//   characteristics: ["dreamborn", "sorcerer", "villain"],
//   text: "**Challenger** +3 (_When challenging, this character get +3 {S}._)",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "challenger",
//       value: 3,
//       text: "**Challenger** +3 (_When challenging, this character get +3 {S}._)",
//     } as ChallengerAbility,
//   ],
//   flavour:
//     "Enough skulking about. It’s time to show that \rsniveling sultan what a sorcerer can do.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Jake Parker",
//   number: 45,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 494098,
//   },
//   rarity: "common",
// };
//
