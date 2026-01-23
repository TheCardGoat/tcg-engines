import type { CharacterCard } from "@tcg/lorcana-types";

export const gazelleAngelWithHorns: CharacterCard = {
  id: "1b1",
  cardType: "character",
  name: "Gazelle",
  version: "Angel with Horns",
  fullName: "Gazelle - Angel with Horns",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "006",
  text: "YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 88,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aba5859d54a986286125b9b32e0aaf4ff2cc4a94",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const gazelleAngelWithHorns: LorcanitoCharacterCard = {
//   id: "ra0",
//   missingTestCase: true,
//   name: "Gazelle",
//   title: "Angel with Horns",
//   characteristics: ["dreamborn", "ally"],
//   text: "YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "ability",
//           ability: "evasive",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Wouter Bruneel",
//   number: 88,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591117,
//   },
//   rarity: "common",
// };
//
