import type { CharacterCard } from "@tcg/lorcana-types";

export const rafikiShamanDuelist: CharacterCard = {
  id: "v9e",
  cardType: "character",
  name: "Rafiki",
  version: "Shaman Duelist",
  fullName: "Rafiki - Shaman Duelist",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "005",
  text: "Rush (This character can challenge the turn they're played.)\nSURPRISING SKILL When you play this character, he gains Challenger +4 this turn. (They get +4 {S} while challenging.)",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 55,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "70ab2b3db6ba7f1aa4c0f7653eb7a3b4f9427c94",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AbilityEffect,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const rafikiShamanDuelist: LorcanitoCharacterCard = {
//   id: "qke",
//   name: "Rafiki",
//   title: "Shaman Duelist",
//   characteristics: ["sorcerer", "storyborn", "mentor"],
//   text: "**Rush** _(This character can challenge the turn they’re played.)_ **SURPRISING SKILL** When you play this character, he gains **Challenger** +4 this turn. _(They get +4 while challenging.)_",
//   type: "character",
//   abilities: [
//     rushAbility,
//     {
//       type: "resolution",
//       name: "SURPRISING SKILL",
//       text: "When you play this character, he gains **Challenger** +4 this turn. _(They get +4 while challenging.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 4,
//           modifier: "add",
//           duration: "turn",
//           target: thisCharacter,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 1,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Giulia Riva",
//   number: 55,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560105,
//   },
//   rarity: "rare",
// };
//
