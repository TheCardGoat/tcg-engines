import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSmeeEfficientCaptain: CharacterCard = {
  id: "1co",
  cardType: "character",
  name: "Mr. Smee",
  version: "Efficient Captain",
  fullName: "Mr. Smee - Efficient Captain",
  inkType: ["emerald", "steel"],
  franchise: "Peter Pan",
  set: "007",
  text: "PIPE UP THE CREW Whenever you play an action that isn't a song, you may ready chosen Pirate character.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 107,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "af71eddc1279e3c929451e656d1d9c68d307965e",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenPirateCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouPlayAnActionNotASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mrSmeeEfficientCaptain: LorcanitoCharacterCard = {
//   id: "at3",
//   name: "Mr. Smee",
//   title: "Efficient Captain",
//   characteristics: ["dreamborn", "villain", "pirate", "captain"],
//   text: "PIPE UP THE CREW Whenever you play an action that isn’t a song, you may ready chosen Pirate character.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayAnActionNotASong({
//       name: "PIPE UP THE CREW",
//       text: "Whenever you play an action that isn’t a song, you may ready chosen Pirate character.",
//       optional: true,
//       effects: [
//         {
//           type: "exert",
//           exert: false,
//           target: chosenPirateCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//
//   colors: ["emerald", "steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   illustrator: "João Moura",
//   number: 107,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618140,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
