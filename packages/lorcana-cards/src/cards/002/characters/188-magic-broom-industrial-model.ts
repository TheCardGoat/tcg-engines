import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomIndustrialModel: CharacterCard = {
  id: "11u",
  cardType: "character",
  name: "Magic Broom",
  version: "Industrial Model",
  fullName: "Magic Broom - Industrial Model",
  inkType: ["steel"],
  franchise: "Fantasia",
  set: "002",
  text: "MAKE IT SHINE When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 188,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "886ba59539c115eb94eaabba8dec4a56a76b26c0",
  },
  abilities: [],
  classifications: ["Dreamborn", "Broom"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const magicBroomIndustrialModel: LorcanitoCharacterCard = {
//   id: "ang",
//
//   name: "Magic Broom",
//   title: "Industrial Model",
//   characteristics: ["dreamborn", "broom"],
//   text: "**MAKE IT SHINE** When you play this character, chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Make it Shine",
//       text: "When you play this character, chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "resist",
//           amount: 1,
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   flavour:
//     "Even with a hauling weight of seriously, a lot, it can only do so much in a magical flood.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Cristian Romero",
//   number: 188,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527777,
//   },
//   rarity: "common",
// };
//
