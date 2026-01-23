import type { CharacterCard } from "@tcg/lorcana-types";

export const edLaughingHyena: CharacterCard = {
  id: "1ez",
  cardType: "character",
  name: "Ed",
  version: "Laughing Hyena",
  fullName: "Ed - Laughing Hyena",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "CAUSE A PANIC When you play this character, you may deal 2 damage to chosen damaged character.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 74,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b7b8cf126ca56fb72ae47f7dc67180a793b855e2",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Hyena"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const edLaughingHyena: LorcanitoCharacterCard = {
//   id: "sgn",
//   missingTestCase: true,
//   name: "Ed",
//   title: "Laughing Hyena",
//   characteristics: ["storyborn", "ally", "hyena"],
//   text: "**CAUSE A PANIC** When you play this character, you may deal 2 damage to chosen damaged character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "CAUSE A PANIC",
//       text: "When you play this character, you may deal 2 damage to chosen damaged character.",
//       optional: true,
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenDamagedCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "A-heh, heh, heh, heh, hee, hee, heeeeee.",
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Otto Paredes",
//   number: 74,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561160,
//   },
//   rarity: "common",
// };
//
