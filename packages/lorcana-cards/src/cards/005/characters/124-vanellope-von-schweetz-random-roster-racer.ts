import type { CharacterCard } from "@tcg/lorcana-types";

export const vanellopeVonSchweetzRandomRosterRacer: CharacterCard = {
  id: "a4q",
  cardType: "character",
  name: "Vanellope von Schweetz",
  version: "Random Roster Racer",
  fullName: "Vanellope von Schweetz - Random Roster Racer",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Rush (This character can challenge the turn they're played.)\nPIXLEXIA When you play this character, she gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 124,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2483833c1a9722badae219f59fbfceff004e5d39",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const vanellopeVonSchweetzRandomRosterRacer: LorcanitoCharacterCard = {
//   id: "zv7",
//   name: "Vanellope von Schweetz",
//   title: "Random Roster Racer",
//   characteristics: ["hero", "storyborn", "princess", "racer"],
//   text: "**Rush** _(This character can challenge the turn they’re played.)_ **PIXLEXIA** When you play this character, she gains **Evasive** until the start of your next turn. _(Only characters with Evasive can challenge them.)_",
//   type: "character",
//   abilities: [
//     rushAbility,
//     {
//       type: "resolution",
//       name: "PIXLEXIA",
//       text: "When you play this character, she gains **Evasive** until the start of your next turn. _(Only characters with Evasive can challenge them.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "evasive",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   colors: ["ruby"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Hyuna Lee",
//   number: 124,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555271,
//   },
//   rarity: "rare",
// };
//
