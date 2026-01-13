import type { CharacterCard } from "@tcg/lorcana-types";

export const pleakleyScientificExpert: CharacterCard = {
  id: "159",
  cardType: "character",
  name: "Pleakley",
  version: "Scientific Expert",
  fullName: "Pleakley - Scientific Expert",
  inkType: ["sapphire"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 144,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "94ae4dc4c313e3605e27d113d392e6156f90089a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Alien"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const pleakleyScientificExpert: LorcanitoCharacterCard = {
//   id: "izw",
//   missingTestCase: true,
//   name: "Pleakley",
//   title: "Scientific Expert",
//   characteristics: ["storyborn", "ally", "alien"],
//   text: "REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Reporting For Duty",
//       text: "When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: chosenCharacterOfYours,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Heidi Neubauer",
//   number: 144,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588341,
//   },
//   rarity: "uncommon",
// };
//
