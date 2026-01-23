import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsQuicktempered: CharacterCard = {
  id: "hry",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Quick-Tempered",
  fullName: "Queen of Hearts - Quick-Tempered",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "ROYAL RAGE When you play this character, deal 1 damage to chosen damaged opposing character.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 90,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "401190d7956bd93a5a06f686c3712e4f7bf4936b",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const queenOfHeartsQuickTempered: LorcanitoCharacterCard = {
//   id: "zbq",
//   name: "Queen of Hearts",
//   title: "Quick-Tempered",
//   characteristics: ["dreamborn", "queen", "villain"],
//   text: "**ROYALE RAGE** When you play this character, deal 1 damage to chosen damaged opposing character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Royale Rage",
//       text: "When you play this character, deal 1 damage to chosen damaged opposing character.",
//       optional: false,
//       effects: [
//         {
//           type: "damage",
//           amount: 1,
//           target: chosenOpposingDamagedCharacter,
//         },
//       ],
//     },
//   ],
//   flavour:
//     '"You know, we could make her really angry. Shall we try?"  \\n−Cheshire Cat',
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Matthew Robert Davies",
//   number: 90,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525079,
//   },
//   rarity: "common",
// };
//
