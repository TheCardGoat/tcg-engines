import type { CharacterCard } from "@tcg/lorcana-types";

export const pepperQuickthinkingPuppy: CharacterCard = {
  id: "15w",
  cardType: "character",
  name: "Pepper",
  version: "Quick-Thinking Puppy",
  fullName: "Pepper - Quick-Thinking Puppy",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 167,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "97098c501f90935ba737140dca7ffd730fac352d",
  },
  abilities: [],
  classifications: ["Storyborn", "Puppy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverOneOfYouCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const pepperQuickthinkingPuppy: LorcanitoCharacterCard = {
//   id: "q6x",
//   name: "Pepper",
//   title: "Quick-Thinking Puppy",
//   characteristics: ["storyborn", "puppy"],
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Rachel Elissa",
//   number: 167,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618249,
//   },
//   rarity: "common",
//   lore: 1,
//   text: "IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.",
//   abilities: [
//     wheneverOneOfYouCharactersIsBanished({
//       name: "In the Nick of Time",
//       text: "Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.",
//       optional: true,
//       triggerTarget: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "characteristics", value: ["puppy"] },
//       ],
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "trigger", value: "target" }],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
