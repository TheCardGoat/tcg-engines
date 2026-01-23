import type { CharacterCard } from "@tcg/lorcana-types";

export const belleOfTheBall: CharacterCard = {
  id: "1j3",
  cardType: "character",
  name: "Belle",
  version: "Of the Ball",
  fullName: "Belle - Of the Ball",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "005",
  text: "Ward (Opponents can't choose this character except to challenge.)\nUSHERED INTO THE PARTY When you play this character, your other characters gain Ward until the start of your next turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 158,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c796ea97ede34aa2b1d64bb7ef28514ead03681f",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const belleOfTheBall: LorcanitoCharacterCard = {
//   id: "npn",
//   missingTestCase: true,
//   name: "Belle",
//   title: "Of the Ball",
//   characteristics: ["hero", "dreamborn", "princess"],
//   text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n \n**USHERED INTO THE PARTY** When you play this character, your other characters gain **Ward** until the start of your next turn.",
//   type: "character",
//   abilities: [
//     wardAbility,
//     {
//       type: "resolution",
//       name: "Ushered Into The Party",
//       text: "When you play this character, your other characters gain **Ward** until the start of your next turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "ward",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: yourOtherCharacters,
//         },
//       ],
//     },
//   ],
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   lore: 2,
//   illustrator: "French Carlomagno",
//   number: 158,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561651,
//   },
//   rarity: "rare",
// };
//
