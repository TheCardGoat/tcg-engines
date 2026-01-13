import type { CharacterCard } from "@tcg/lorcana-types";

export const rabbitIndignantPirate: CharacterCard = {
  id: "1cx",
  cardType: "character",
  name: "Rabbit",
  version: "Indignant Pirate",
  fullName: "Rabbit - Indignant Pirate",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 22,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b04d53c72e0daaa51190f5bfd88e9191a2d259cc",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const rabbitIndignantPirate: LorcanitoCharacterCard = {
//   id: "rdz",
//   missingTestCase: true,
//   name: "Rabbit",
//   title: "Indignant Pirate",
//   characteristics: ["dreamborn", "ally", "pirate"],
//   text: "BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Indignant Pirate",
//       text: "When you play this character, you may remove up to 1 damage from chosen character.",
//       optional: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 1,
//           upTo: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Samoldstoree",
//   number: 22,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587238,
//   },
//   rarity: "common",
// };
//
