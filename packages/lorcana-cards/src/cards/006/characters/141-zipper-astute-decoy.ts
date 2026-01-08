import type { CharacterCard } from "@tcg/lorcana-types";

export const zipperAstuteDecoy: CharacterCard = {
  id: "n08",
  cardType: "character",
  name: "Zipper",
  version: "Astute Decoy",
  fullName: "Zipper - Astute Decoy",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)\nRUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 141,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "52eab6990d88727659a47fd96cbda02e69229a99",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { anotherChosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const zipperAstuteDecoy: LorcanitoCharacterCard = {
//   id: "x2n",
//   missingTestCase: true,
//   name: "Zipper",
//   title: "Astute Decoy",
//   characteristics: ["storyborn", "ally"],
//   text: "Ward (Opponents can't choose this character except to challenge.)\nRUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
//   type: "character",
//   abilities: [
//     wardAbility,
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Run Interference",
//       text: "During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
//       conditions: [duringYourTurn],
//       effects: [
//         {
//           type: "ability",
//           ability: "resist",
//           amount: 1,
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: anotherChosenCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Eri Welli",
//   number: 141,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588338,
//   },
//   rarity: "rare",
// };
//
