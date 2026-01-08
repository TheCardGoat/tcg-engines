import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaStormChaser: CharacterCard = {
  id: "ih5",
  cardType: "character",
  name: "Elsa",
  version: "Storm Chaser",
  fullName: "Elsa - Storm Chaser",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "004",
  text: "TEMPEST {E} — Chosen character gains Challenger +2 and Rush this turn. (They get +2 {S} while challenging. They can challenge the turn they're played.)",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 42,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4297327bb398ea35bc56d33043916d26c0135202",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const elsaStormChaser: LorcanitoCharacterCard = {
//   id: "m70",
//   missingTestCase: true,
//   name: "Elsa",
//   title: "Storm Chaser",
//   characteristics: ["hero", "queen", "sorcerer", "storyborn"],
//   text: "**TEMPEST** {E}− Chosen character gains **Challenger** +2 and **Rush** this turn. _(They get +2 {S} while challenging. They can challenge the turn they're played.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "Tempest",
//       text: "Chosen character gains **Challenger** +2 and **Rush** this turn.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           modifier: "add",
//           amount: 2,
//           duration: "turn",
//           target: chosenCharacter,
//         },
//         {
//           type: "ability",
//           ability: "rush",
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "After Elsa dispersed Ursula's storm, Anna was nowhere to be found.",
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Mariana Mareno",
//   number: 42,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547847,
//   },
//   rarity: "rare",
// };
//
