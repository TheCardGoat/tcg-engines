import type { CharacterCard } from "@tcg/lorcana-types";

export const olafHappyPassenger: CharacterCard = {
  id: "trf",
  cardType: "character",
  name: "Olaf",
  version: "Happy Passenger",
  fullName: "Olaf - Happy Passenger",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "CLEAR THE PATH For each exerted character opponents have in play, you pay 1 {I} less to play this character.\nEvasive (Only characters with Evasive can challenge this character.)",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 3,
  cardNumber: 50,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6b436a5973bdf158f42db6f0468d40f368f6e4e9",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const olafHappyPassenger: LorcanitoCharacterCard = {
//   id: "j4c",
//   name: "Olaf",
//   title: "Happy Passenger",
//   characteristics: ["storyborn", "ally"],
//   text: "**CLEAR THE PATH** For each exerted character opponents have in play, you pay 1 {I} less to play this character.<br/>**Evasive** _(Only characters with Evasive can challenge this character.)_",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     whenYouPlayThisForEachYouPayLess({
//       name: "**CLEAR THE PATH**",
//       text: "For each exerted character opponents have in play, you pay 1 {I} less to play this character.",
//       amount: {
//         dynamic: true,
//         filters: [
//           { filter: "owner", value: "opponent" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "status", value: "exerted" },
//         ],
//       },
//     }),
//   ],
//   colors: ["amethyst"],
//   cost: 9,
//   strength: 6,
//   willpower: 6,
//   lore: 3,
//   illustrator: "Andrea Parisi",
//   number: 50,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561489,
//   },
//   rarity: "rare",
// };
//
