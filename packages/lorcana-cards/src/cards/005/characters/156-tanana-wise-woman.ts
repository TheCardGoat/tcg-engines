import type { CharacterCard } from "@tcg/lorcana-types";

export const tananaWiseWoman: CharacterCard = {
  id: "1b7",
  cardType: "character",
  name: "Tanana",
  version: "Wise Woman",
  fullName: "Tanana - Wise Woman",
  inkType: ["sapphire"],
  franchise: "Brother Bear",
  set: "005",
  text: "YOUR BROTHERS NEED GUIDANCE When you play this character, you may remove up to 1 damage from chosen character or location.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 156,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "abb164419a1662267b844213eb8ebf1ee2c6dce6",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOrLocation } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const tananaWiseWoman: LorcanitoCharacterCard = {
//   id: "x30",
//   name: "Tanana",
//   title: "Wise Woman",
//   characteristics: ["storyborn", "ally"],
//   text: "**YOUR BROTHERS NEED GUIDANCE** When you play this character, you may remove up to 1 damage from chosen character or location.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "YOUR BROTHERS NEED GUIDANCE",
//       text: "When you play this character, you may remove up to 1 damage from chosen character or location.",
//       optional: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 1,
//           upTo: true,
//           target: chosenCharacterOrLocation,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 156,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560493,
//   },
//   rarity: "common",
// };
//
