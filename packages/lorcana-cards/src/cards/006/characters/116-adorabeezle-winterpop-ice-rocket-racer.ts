import type { CharacterCard } from "@tcg/lorcana-types";

export const adorabeezleWinterpopIceRocketRacer: CharacterCard = {
  id: "zbp",
  cardType: "character",
  name: "Adorabeezle Winterpop",
  version: "Ice Rocket Racer",
  fullName: "Adorabeezle Winterpop - Ice Rocket Racer",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "KEEP DRIVING While this character has damage, she gets +1 {L}.",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 116,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7f503ec5fca52d7edab45e335055d55e8ba18ad6",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileThisCharacterHasDamageGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const adorabeezleWinterpopIceRocketRacer: LorcanitoCharacterCard = {
//   id: "km9",
//   name: "Adorabeezle Winterpop",
//   title: "Ice Rocket Racer",
//   characteristics: ["storyborn", "hero", "racer"],
//   text: "KEEP DRIVING While this character has damage, she gets +1 {L}.",
//   type: "character",
//   abilities: [
//     whileThisCharacterHasDamageGets({
//       name: "Keep Driving",
//       text: "While this character has damage, she gets +1 {L}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "static",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 1,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Cristian Romero",
//   number: 116,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 583721,
//   },
//   rarity: "common",
// };
//
