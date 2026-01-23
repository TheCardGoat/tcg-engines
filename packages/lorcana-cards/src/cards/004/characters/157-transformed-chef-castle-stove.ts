import type { CharacterCard } from "@tcg/lorcana-types";

export const transformedChefCastleStove: CharacterCard = {
  id: "1t8",
  cardType: "character",
  name: "Transformed Chef",
  version: "Castle Stove",
  fullName: "Transformed Chef - Castle Stove",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "A CULINARY MASTERPIECE When you play this character, remove up to 2 damage from chosen character.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 157,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "eacf9cb4d5bec8eaa5cfe81734389608ea2cd322",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const transformedChefCastleStove: LorcanitoCharacterCard = {
//   id: "szw",
//   missingTestCase: true,
//   name: "Transformed Chef",
//   title: "Castle Stove",
//   characteristics: ["storyborn", "ally"],
//   text: "**SMOOTH SMALL DISHES** When you play this character, remove up to 2 damage from chosen character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "SMOOTH SMALL DISHES",
//       text: "When you play this character, remove up to 2 damage from chosen character.",
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "A good hot meal will put you back on your feet.\n−Madame Samovar",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "James C Mulligan",
//   number: 157,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550528,
//   },
//   rarity: "common",
// };
//
