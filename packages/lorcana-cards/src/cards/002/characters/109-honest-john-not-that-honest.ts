import type { CharacterCard } from "@tcg/lorcana-types";

export const honestJohnNotThatHonest: CharacterCard = {
  id: "1de",
  cardType: "character",
  name: "Honest John",
  version: "Not That Honest",
  fullName: "Honest John - Not That Honest",
  inkType: ["ruby"],
  franchise: "Pinocchio",
  set: "002",
  text: "EASY STREET Whenever you play a Floodborn character, each opponent loses 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 109,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b3edb87ace39ce0527520caef3e29894e03b5816",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverYouPlayAFloodBorn } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const honestJohnNotThatHonest: LorcanitoCharacterCard = {
//   id: "hkq",
//
//   name: "Honest John",
//   title: "Not That Honest",
//   characteristics: ["storyborn", "villain"],
//   text: "**EASY STREET** Whenever you play a Floodborn character, each opponent loses 1 lore.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayAFloodBorn({
//       name: "Easy Street",
//       text: "Whenever you play a Floodborn character, each opponent loses 1 lore.",
//       effects: [
//         {
//           type: "lore",
//           amount: 1,
//           modifier: "subtract",
//           target: {
//             type: "player",
//             value: "opponent",
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "A thing like that ought to be worth a fortune to someone!",
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Sandra Rios",
//   number: 109,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527275,
//   },
//   rarity: "rare",
// };
//
