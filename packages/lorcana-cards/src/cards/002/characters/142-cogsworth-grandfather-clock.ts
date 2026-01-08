import type { CharacterCard } from "@tcg/lorcana-types";

export const cogsworthGrandfatherClock: CharacterCard = {
  id: "184",
  cardType: "character",
  name: "Cogsworth",
  version: "Grandfather Clock",
  fullName: "Cogsworth - Grandfather Clock",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cogsworth.)\nWard (Opponents can't choose this character except to challenge.)\nUNWIND Your other characters gain Resist +1 (Damage dealt to them is reduced by 1.)",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 142,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a1c1148044f285d2b55c6344c445f396d8b4c5a2",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   resistAbility,
//   shiftAbility,
//   wardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/target";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const cogsworthGrandfatherClock: LorcanitoCharacterCard = {
//   id: "kv8",
//   name: "Cogsworth",
//   title: "Grandfather Clock",
//   characteristics: ["floodborn", "ally"],
//   text: "**Shift** 3 _You may pay 3 {I} to play this on top of one of your characters named Cogsworth.)_ **Ward** _(Opponents can't choose this character except to challenge.)_\n\n**UNWIND** Your other characters gain **Resist** +1 _(Damage dealt to them is reduced by 1.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Unwind",
//       text: "Your other characters gain **Resist** +1",
//       gainedAbility: resistAbility(1),
//       target: yourOtherCharacters,
//     },
//     wardAbility,
//     shiftAbility(3, "cogsworth"),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 2,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Isaiah Mesq",
//   number: 142,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 517595,
//   },
//   rarity: "super_rare",
// };
//
