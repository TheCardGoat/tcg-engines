import type { CharacterCard } from "@tcg/lorcana-types";

export const scarHeartlessHunter: CharacterCard = {
  id: "mp6",
  cardType: "character",
  name: "Scar",
  version: "Heartless Hunter",
  fullName: "Scar - Heartless Hunter",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "006",
  text: "BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.",
  cost: 5,
  strength: 4,
  willpower: 2,
  lore: 3,
  cardNumber: 127,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "51cf185eed5f063045efe5e721db44e75fd71f54",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   chosenCharacterOfYours,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const scarHeartlessHunter: LorcanitoCharacterCard = {
//   id: "r0e",
//   missingTestCase: true,
//   name: "Scar",
//   title: "Heartless Hunter",
//   characteristics: ["storyborn", "villain"],
//   text: "BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Bared Teeth",
//       text: "When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.",
//       dependentEffects: true,
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenCharacterOfYours,
//         },
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 4,
//   willpower: 2,
//   lore: 3,
//   illustrator: "Cookie",
//   number: 127,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591122,
//   },
//   rarity: "super_rare",
// };
//
