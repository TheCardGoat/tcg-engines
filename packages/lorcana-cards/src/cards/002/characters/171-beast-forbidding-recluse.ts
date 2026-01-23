import type { CharacterCard } from "@tcg/lorcana-types";

export const beastForbiddingRecluse: CharacterCard = {
  id: "682",
  cardType: "character",
  name: "Beast",
  version: "Forbidding Recluse",
  fullName: "Beast - Forbidding Recluse",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "YOU'RE NOT WELCOME HERE When you play this character, you may deal 1 damage to chosen character.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 171,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "166eafad1d590ff957396077a5bee751b022c264",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const beastForbiddingRecluse: LorcanitoCharacterCard = {
//   id: "j93",
//
//   name: "Beast",
//   title: "Forbidding Recluse",
//   characteristics: ["hero", "dreamborn", "prince"],
//   text: "**YOU'RE NOT WELCOME HERE** When you play this character, you may deal 1 damage to chosen character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "You're not welcome here",
//       text: "When you play this character, you may deal 1 damage to chosen character.",
//       optional: true,
//
//       effects: [
//         {
//           type: "damage",
//           amount: 1,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "Woe to the one who draws his gaze.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 171,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527533,
//   },
//   rarity: "common",
// };
//
