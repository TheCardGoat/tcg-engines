import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaTheFifthSpirit: CharacterCard = {
  id: "dwf",
  cardType: "character",
  name: "Elsa",
  version: "The Fifth Spirit",
  fullName: "Elsa - The Fifth Spirit",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nCRYSTALLIZE When you play this character, exert chosen opposing character.",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 48,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3219378181dc565b5d4b7488cccbc75d171bb04f",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   rushAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const elsaTheFifthSpirit: LorcanitoCharacterCard = {
//   id: "pm7",
//   name: "Elsa",
//   title: "The Fifth Spirit",
//   characteristics: ["hero", "dreamborn", "queen", "sorcerer"],
//   text: "**Rush** _(This character can challenge the turn they’re played.)_   **Evasive** _(Only characters with Evasive can challenge this character.)_   **CRYSTALLIZE** When you play this character, exert chosen opposing character.",
//   type: "character",
//   abilities: [
//     rushAbility,
//     evasiveAbility,
//     {
//       type: "resolution",
//       name: "CRYSTALLIZE",
//       text: "When you play this character, exert chosen opposing character.",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 2,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Lisanne Koeteeuw",
//   number: 48,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555245,
//   },
//   rarity: "super_rare",
// };
//
