import type { CharacterCard } from "@tcg/lorcana-types";

export const hiroHamadaRoboticsProdigy: CharacterCard = {
  id: "r87",
  cardType: "character",
  name: "Hiro Hamada",
  version: "Robotics Prodigy",
  fullName: "Hiro Hamada - Robotics Prodigy",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "SWEET TECH {2} {E} - Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 1,
  cardNumber: 145,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6221b7a9a5416d22eb42da8eb9fdc0b92ea2e928",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const hiroHamadaRoboticsProdigy: LorcanitoCharacterCard = {
//   id: "b0j",
//   name: "Hiro Hamada",
//   title: "Robotics Prodigy",
//   characteristics: ["hero", "storyborn", "inventor"],
//   text: "**SWEET TECH**  {E}, 2 {I} − Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "SWEET TECH",
//       text: " {E}, 2 {I} − Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       dependentEffects: true,
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "shuffle-deck",
//           target: self,
//         },
//         {
//           type: "move",
//           to: "deck",
//           bottom: false,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "deck" },
//               { filter: "owner", value: "self" },
//               {
//                 filter: "characteristics",
//                 value: ["robot", "item"],
//                 conjunction: "or",
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "A couple more tweaks and I've just about . . . got it!",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 0,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Denny Minonne",
//   number: 145,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578190,
//   },
//   rarity: "uncommon",
// };
//
