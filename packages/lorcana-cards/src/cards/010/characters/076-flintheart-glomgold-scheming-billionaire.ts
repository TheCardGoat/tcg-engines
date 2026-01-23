import type { CharacterCard } from "@tcg/lorcana-types";

export const flintheartGlomgoldSchemingBillionaire: CharacterCard = {
  id: "l2o",
  cardType: "character",
  name: "Flintheart Glomgold",
  version: "Scheming Billionaire",
  fullName: "Flintheart Glomgold - Scheming Billionaire",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "TRY ME While you have a character or location in play with a card under them, this character gains Ward. (Opponents can't choose them except to challenge.)",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 3,
  cardNumber: 76,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4bf477933d696ffd96d9d3c933e07689ec893de3",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   whileConditionOnThisCharacterTargetsGain,
//   whileConditionThisCharacterGets,
// } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import { haveACharOrLocationWithACardUnder } from "@lorcanito/lorcana-engine/cards/010/characters/009-webby-vanderquack-knowledge-seeker";
//
// export const flintheartGlomgoldSchemingBillionaire: LorcanitoCharacterCard = {
//   id: "mkt",
//   name: "Flintheart Glomgold",
//   title: "Scheming Billionaire",
//   characteristics: ["storyborn", "villain"],
//   text: "TRY ME While you have a character or location in play with a card under them, this character gains Ward. (Opponents can't choose them except to challenge.)",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 1,
//   willpower: 4,
//   illustrator: "Mike Parker",
//   number: 76,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659184,
//   },
//   rarity: "uncommon",
//   abilities: [
//     whileConditionOnThisCharacterTargetsGain({
//       name: "TRY ME",
//       text: "While you have a character or location in play with a card under them, this character gains Ward. (Opponents can't choose them except to challenge.)",
//       conditions: [haveACharOrLocationWithACardUnder],
//       ability: wardAbility,
//       target: thisCharacter,
//     }),
//   ],
//   lore: 3,
// };
//
