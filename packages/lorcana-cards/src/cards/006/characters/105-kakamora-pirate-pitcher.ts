import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraPiratePitcher: CharacterCard = {
  id: "xu8",
  cardType: "character",
  name: "Kakamora",
  version: "Pirate Pitcher",
  fullName: "Kakamora - Pirate Pitcher",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  text: "DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 105,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "79f65d15a684177f3f64714d83bd3b2b626893fb",
  },
  abilities: [],
  classifications: ["Storyborn", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenPirateCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const kakamoraPiratePitcher: LorcanitoCharacterCard = {
//   id: "f6t",
//   name: "Kakamora",
//   title: "Pirate Pitcher",
//   characteristics: ["storyborn", "pirate"],
//   text: "DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Dizzying Speed",
//       text: "When you play this character, chosen Pirate character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
//       effects: [
//         {
//           type: "ability",
//           ability: "evasive",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenPirateCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Saulo Nate",
//   number: 105,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588362,
//   },
//   rarity: "common",
// };
//
