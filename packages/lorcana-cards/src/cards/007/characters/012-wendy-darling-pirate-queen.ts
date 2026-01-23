import type { CharacterCard } from "@tcg/lorcana-types";

export const wendyDarlingPirateQueen: CharacterCard = {
  id: "1oj",
  cardType: "character",
  name: "Wendy Darling",
  version: "Pirate Queen",
  fullName: "Wendy Darling - Pirate Queen",
  inkType: ["amber", "ruby"],
  franchise: "Peter Pan",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nTELL NO TALES Whenever one of your other characters is banished, you may remove all damage from chosen character.",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 2,
  cardNumber: 12,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "da2e6704efe9fa9440082d5430d64696d469d7e2",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Queen", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYourOtherCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const wendyDarlingPirateQueen: LorcanitoCharacterCard = {
//   id: "ge4",
//   name: "Wendy Darling",
//   title: "Pirate Queen",
//   characteristics: ["dreamborn", "hero", "queen", "pirate", "captain"],
//   text: "Evasive\nTELL NO TALES Whenever one of your other characters is banished, you may remove all damage from chosen character.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     whenYourOtherCharactersIsBanished({
//       name: "TELL NO TALES",
//       text: "Whenever one of your other characters is banished, you may remove all damage from chosen character.",
//       optional: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 99,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//
//   colors: ["amber", "ruby"],
//   cost: 7,
//   strength: 5,
//   willpower: 7,
//   illustrator: "Jochem van Gool",
//   number: 12,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619413,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
