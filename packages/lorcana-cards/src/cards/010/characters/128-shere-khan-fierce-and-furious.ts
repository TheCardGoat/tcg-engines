import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanFierceAndFurious: CharacterCard = {
  id: "1uf",
  cardType: "character",
  name: "Shere Khan",
  version: "Fierce and Furious",
  fullName: "Shere Khan - Fierce and Furious",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "010",
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Shere Khan.)\nWILD RAGE 1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.",
  cost: 8,
  strength: 8,
  willpower: 8,
  lore: 2,
  cardNumber: 128,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ef72f964d64111f6e9cb2f86c285f530b47afe0c",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// const wildRage: ActivatedAbility = {
//   type: "activated",
//   name: "WILD RAGE",
//   text: "1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.",
//   costs: [{ type: "ink", amount: 1 }],
//   effects: [
//     {
//       type: "damage",
//       amount: 1,
//       target: thisCharacter,
//     },
//     ...readyAndCantQuest(thisCharacter),
//   ],
// };
//
// export const shereKhanFierceAndFurious: LorcanitoCharacterCard = {
//   id: "fee",
//   name: "Shere Khan",
//   title: "Fierce and Furious",
//   characteristics: ["floodborn", "villain"],
//   text: "Shift 5 {I}\n\nWILD RAGE 1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 8,
//   strength: 8,
//   willpower: 8,
//   illustrator: "Roger Pérez",
//   number: 128,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659419,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [shiftAbility(5, "Shere Khan"), wildRage],
// };
//
