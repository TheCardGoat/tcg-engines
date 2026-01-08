import type { CharacterCard } from "@tcg/lorcana-types";

export const banzaiTauntingHyena: CharacterCard = {
  id: "16q",
  cardType: "character",
  name: "Banzai",
  version: "Taunting Hyena",
  fullName: "Banzai - Taunting Hyena",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "HERE KITTY, KITTY, KITTY When you play this character, you may exert chosen damaged character.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 87,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "99fe726d4ae141e3026532d3a15a14a8de9b72c6",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Hyena"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const banzaiTauntingHyena: LorcanitoCharacterCard = {
//   id: "qgg",
//   name: "Banzai",
//   title: "Taunting Hyena",
//   characteristics: ["storyborn", "ally", "hyena"],
//   text: "**HERE KITTY, KITTY, KITTY** When you play this character, you may exert chosen damaged character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "HERE KITTY, KITTY, KITTY",
//       text: "When you play this character, you may exert chosen damaged character.",
//       optional: true,
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: chosenDamagedCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "What do we got here, a little snack pack?",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Alexandria Neonakis",
//   number: 87,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561162,
//   },
//   rarity: "common",
// };
//
