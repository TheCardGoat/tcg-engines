import type { CharacterCard } from "@tcg/lorcana-types";

export const almaMadrigalFamilyMatriarch: CharacterCard = {
  id: "6uc",
  cardType: "character",
  name: "Alma Madrigal",
  version: "Family Matriarch",
  fullName: "Alma Madrigal - Family Matriarch",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  text: "TO THE TABLE When you play this character, you may search your deck for a Madrigal character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 2,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "18a98fa235abcf4d0b586d93830e89dc0ca67460",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const almaMadrigalFamilyMatriarch: LorcanitoCharacterCard = {
//   id: "lxy",
//   name: "Alma Madrigal",
//   title: "Family Matriarch",
//   characteristics: ["storyborn", "mentor", "madrigal"],
//   text: "**ALL AT THE TABLE** When you play this character, look at your deck. You may reveal a Madrigal character card. Shuffle your deck and put that card on top of your deck.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "ALL AT THE TABLE",
//       dependentEffects: true,
//       resolveEffectsIndividually: true,
//       text: "When you play this character, look at your deck. You may reveal a Madrigal character card. Shuffle your deck and put that card on top of your deck.",
//       effects: [
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
//               { filter: "characteristics", value: ["madrigal"] },
//             ],
//           },
//         },
//         {
//           type: "shuffle-deck",
//           target: self,
//         },
//       ],
//     },
//   ],
//   flavour: "Let's be clear Abuela runs this show\n– Mirabel",
//   colors: ["amber"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Maxine Vee",
//   number: 2,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550553,
//   },
//   rarity: "rare",
// };
//
