import type { CharacterCard } from "@tcg/lorcana-types";

export const chiefBogoRespectedOfficer: CharacterCard = {
  id: "1q6",
  cardType: "character",
  name: "Chief Bogo",
  version: "Respected Officer",
  fullName: "Chief Bogo - Respected Officer",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "002",
  text: "INSUBORDINATION! Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 175,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e2241ad74c9e4ea143116d7866417f72982e755c",
  },
  abilities: [],
  classifications: ["Dreamborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { opposingCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouPlayAFloodBorn } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const chiefBogoRespectedOfficer: LorcanitoCharacterCard = {
//   id: "qpr",
//   name: "Chief Bogo",
//   title: "Respected Officer",
//   characteristics: ["dreamborn"],
//   text: "**INSUBORDINATION!** Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayAFloodBorn({
//       name: "Insubordination!",
//       text: "Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
//       effects: [
//         {
//           type: "damage",
//           amount: 1,
//           target: opposingCharacters,
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "We can confirm the ink flood was caused by an explosion. We have it under control−now clear the area.",
//   colors: ["steel"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Adam Banch",
//   number: 175,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526396,
//   },
//   rarity: "rare",
// };
//
