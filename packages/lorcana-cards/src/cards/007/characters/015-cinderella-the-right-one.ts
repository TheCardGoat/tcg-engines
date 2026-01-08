import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaTheRightOne: CharacterCard = {
  id: "doc",
  cardType: "character",
  name: "Cinderella",
  version: "The Right One",
  fullName: "Cinderella - The Right One",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "007",
  text: "IF THE SLIPPER FITS When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 15,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "314a16eb5a595cf0c7fefa00777939b5e367ef18",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const cinderellaTheRightOne: LorcanitoCharacterCard = {
//   id: "v64",
//   name: "Cinderella",
//   title: "The Right One",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "IF THE SLIPPER FITS When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.",
//   type: "character",
//   abilities: [
//     whenYouPlayThis({
//       name: "IF THE SLIPPER FITS",
//       text: "When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "deck",
//           bottom: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "discard" },
//               {
//                 filter: "attribute",
//                 value: "name",
//                 comparison: { operator: "eq", value: "The Glass Slipper" },
//               },
//             ],
//           },
//           forEach: [
//             {
//               type: "lore",
//               amount: 3,
//               modifier: "add",
//               target: self,
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Tania Soler",
//   number: 15,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619415,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
