import type { CharacterCard } from "@tcg/lorcana-types";

export const chiefBogoCallingTheShots: CharacterCard = {
  id: "bzc",
  cardType: "character",
  name: "Chief Bogo",
  version: "Calling the Shots",
  fullName: "Chief Bogo - Calling the Shots",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  text: "MY JURISDICTION During your turn, this character can't be dealt damage.\nDEPUTIZE Your other characters gain the Detective classification.",
  cost: 4,
  strength: 4,
  willpower: 1,
  lore: 1,
  cardNumber: 185,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2b2ecb62f61262c3bd2b59b4e6e88812c046b292",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import type {
//   GainAbilityStaticAbility,
//   StaticAbilityWithEffect,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/target";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// const myJurisdiction: GainAbilityStaticAbility = {
//   type: "static",
//   ability: "gain-ability",
//   name: "MY JURISDICTION",
//   text: "During your turn, this character can't be dealt damage.",
//   conditions: [duringYourTurn],
//   target: thisCharacter,
//   gainedAbility: {
//     type: "static",
//     ability: "effects",
//     effects: [
//       {
//         type: "protection",
//         from: "damage",
//         target: {
//           type: "card",
//           value: "all",
//           filters: [{ filter: "zone", value: "play" }],
//         },
//       },
//     ],
//   },
// };
//
// const deputize: GainAbilityStaticAbility = {
//   type: "static",
//   ability: "gain-ability",
//   name: "DEPUTIZE",
//   text: "Your other characters gain the Detective classification.",
//   target: yourOtherCharacters,
//   gainedAbility: {
//     type: "static",
//     ability: "effects",
//     effects: [
//       {
//         type: "characteristic",
//         characteristics: ["detective"],
//         modifier: "add",
//         target: thisCharacter,
//       },
//     ],
//   },
// };
//
// export const chiefBogoCallingTheShots: LorcanitoCharacterCard = {
//   id: "bi7",
//   name: "Chief Bogo",
//   title: "Calling the Shots",
//   characteristics: ["storyborn"],
//   text: "MY JURISDICTION During your turn, this character can't be dealt damage. DEPUTIZE Your other characters gain the Detective classification.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 4,
//   willpower: 1,
//   illustrator: "Marco Guadalupi",
//   number: 185,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660273,
//   },
//   rarity: "rare",
//   abilities: [myJurisdiction, deputize],
//   lore: 1,
// };
//
