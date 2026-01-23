import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxPersonalHealthcareCompanion: CharacterCard = {
  id: "1p5",
  cardType: "character",
  name: "Baymax",
  version: "Personal Healthcare Companion",
  fullName: "Baymax - Personal Healthcare Companion",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "FULLY CHARGED If you have an Inventor character in play, you pay 1 {I} less to play this character.\nYOU SAID 'OW' 2 {I} - Remove up to 1 damage from another chosen character.",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 2,
  cardNumber: 156,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dcbcc092217bb31b8bc790a740f918c336552b29",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Robot"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { ifYouHaveAnInventor } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { anotherChosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const baymaxPersonalHealthcareCompanion: LorcanitoCharacterCard = {
//   id: "rk5",
//   name: "Baymax",
//   title: "Personal Healthcare Companion",
//   characteristics: ["hero", "storyborn", "robot"],
//   text: "**FULLY CHARGED** If you have an Inventor character in play, you pay 1 {I} less to play this character.\n\n**YOU SAID 'OW'** 2 {I} - Remove up to 1 damage from another chosen character.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisForEachYouPayLess({
//       name: "FULLY CHARGED",
//       text: "If you have an Inventor character in play, you pay 1 {I} less to play this character.",
//       amount: 1,
//       conditions: [ifYouHaveAnInventor],
//     }),
//     {
//       type: "activated",
//       name: "YOU SAID 'OW'",
//       text: "2 {I} - Remove up to 1 damage from another chosen character.",
//       costs: [{ type: "ink", amount: 2 }],
//       effects: [
//         {
//           type: "heal",
//           amount: 1,
//           upTo: true,
//           target: anotherChosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 0,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Jared Mathews",
//   number: 156,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578233,
//   },
//   rarity: "rare",
// };
//
