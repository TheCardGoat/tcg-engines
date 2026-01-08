import type { LocationCard } from "@tcg/lorcana-types";

export const instituteOfTechnologyPrestigiousUniversity: LocationCard = {
  id: "5mi",
  cardType: "location",
  name: "Institute of Technology",
  version: "Prestigious University",
  fullName: "Institute of Technology - Prestigious University",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "WELCOME TO THE LAB Inventor characters get +1 {W} while here.\nPUSH THE BOUNDARIES At the start of your turn, if you have a character here, gain 1 lore.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 170,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "00902a5a0fbc97e1a6a6e0901d349c5cd34db777",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { ifYouHaveACharacterHere } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const instituteOfTechnologyPrestigiousUniversity: LorcanitoLocationCard =
//   {
//     id: "hsg",
//     name: "Institute of Technology",
//     title: "Prestigious University",
//     characteristics: ["location"],
//     text: "WELCOME TO THE LAB Inventor characters get +1 {W} while here.\nPUSH THE BOUNDARIES At the start of your turn, if you have a character here, gain 1 lore.",
//     type: "location",
//     abilities: [
//       atTheStartOfYourTurn({
//         name: "Push the Boundaries",
//         text: "At the start of your turn, if you have a character here, gain 1 lore.",
//         conditions: [ifYouHaveACharacterHere],
//         effects: [youGainLore(1)],
//       }),
//       gainAbilityWhileHere({
//         name: "Welcome to the Lab",
//         text: "Characters get +1 {W} while here.",
//         ability: {
//           type: "static",
//           ability: "effects",
//           effects: [
//             {
//               type: "attribute",
//               attribute: "willpower",
//               amount: 1,
//               modifier: "add",
//               duration: "static",
//               target: thisCharacter,
//             },
//           ],
//         },
//       }),
//     ],
//     inkwell: true,
//     colors: ["sapphire"],
//     cost: 1,
//     moveCost: 1,
//     willpower: 5,
//     illustrator: "Gabe",
//     number: 170,
//     set: "006",
//     externalIds: {
//       tcgPlayer: 591988,
//     },
//     rarity: "common",
//   };
//
