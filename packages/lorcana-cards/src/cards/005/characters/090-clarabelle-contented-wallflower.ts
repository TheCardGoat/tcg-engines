import type { CharacterCard } from "@tcg/lorcana-types";

export const clarabelleContentedWallflower: CharacterCard = {
  id: "1v9",
  cardType: "character",
  name: "Clarabelle",
  version: "Contented Wallflower",
  fullName: "Clarabelle - Contented Wallflower",
  inkType: ["emerald"],
  set: "005",
  text: "ONE STEP BEHIND When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 90,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f2123da0366f4fab7d748e1632bb5c20732c94ab",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const clarabelleContentedWallflower: LorcanitoCharacterCard = {
//   id: "qp1",
//   missingTestCase: true,
//   name: "Clarabelle",
//   title: "Contented Wallflower",
//   characteristics: ["storyborn", "ally"],
//   text: "**ONE STEP BEHIND** When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "ONE STEP BEHIND",
//       text: "When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
//       optional: true,
//       resolutionConditions: [
//         {
//           type: "hand",
//           amount: "lt",
//           player: "self",
//         },
//       ],
//       effects: [drawACard],
//     },
//   ],
//   flavour: "Golly! Those dancers can really moo-ve!",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Lissette Carrera",
//   number: 90,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559513,
//   },
//   rarity: "uncommon",
// };
//
