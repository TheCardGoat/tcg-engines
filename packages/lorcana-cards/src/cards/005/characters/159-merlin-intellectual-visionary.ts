import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinIntellectualVisionary: CharacterCard = {
  id: "1g2",
  cardType: "character",
  name: "Merlin",
  version: "Intellectual Visionary",
  fullName: "Merlin - Intellectual Visionary",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Merlin.)\nOVERDEVELOPED BRAIN When you play this character, if you used Shift to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.",
  cost: 6,
  strength: 3,
  willpower: 7,
  lore: 2,
  cardNumber: 159,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bba8990971606047f1bc8e18917bc3d0f888d38b",
  },
  abilities: [],
  classifications: ["Floodborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const merlinIntellectualVisionary: LorcanitoCharacterCard = {
//   id: "cmp",
//   missingTestCase: true,
//   name: "Merlin",
//   title: "Intellectual Visionary",
//   characteristics: ["floodborn", "sorcerer", "mentor"],
//   text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Merlin.)_**OVERDEVELOPED BRAIN** When you play this character, if you used **Shift** to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "Merlin"),
//     {
//       type: "resolution",
//       name: "Overdeveloped Brain",
//       text: "When you play this character, if you used **Shift** to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.",
//       resolutionConditions: [{ type: "resolution", value: "shift" }],
//       effects: [
//         {
//           type: "shuffle-deck",
//           target: self,
//         },
//         {
//           type: "move",
//           to: "hand",
//           isPrivate: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "deck" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 3,
//   willpower: 7,
//   lore: 2,
//   illustrator: "Jake Parker",
//   number: 159,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555272,
//   },
//   rarity: "legendary",
// };
//
