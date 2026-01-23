import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseDrumMajor: CharacterCard = {
  id: "o0p",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Drum Major",
  fullName: "Minnie Mouse - Drum Major",
  inkType: ["amber"],
  set: "005",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Minnie Mouse.)\nPARADE ORDER When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 15,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5691a241218d73c335bda2e1619d1160eff5e117",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const minnieMouseDrumMajor: LorcanitoCharacterCard = {
//   id: "p4a",
//   name: "Minnie Mouse",
//   title: "Drum Major",
//   characteristics: ["hero", "floodborn"],
//   text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Minnie Mouse.)_\n \n**PARADE ORDER** When you play this character, if you used **Shift** to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Minnie Mouse"),
//     {
//       type: "resolution",
//       name: "PARADE ORDER",
//       text: "When you play this character, if you used **Shift** to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
//       resolutionConditions: [{ type: "resolution", value: "shift" }],
//       effects: [
//         {
//           type: "shuffle-deck",
//           target: self,
//         },
//         {
//           type: "move",
//           to: "deck",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "deck" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Roger Pérez / Leonardo Giammichele",
//   number: 15,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561600,
//   },
//   rarity: "super_rare",
// };
//
