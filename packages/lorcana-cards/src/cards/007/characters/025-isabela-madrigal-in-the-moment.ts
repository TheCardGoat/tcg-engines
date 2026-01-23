import type { CharacterCard } from "@tcg/lorcana-types";

export const isabelaMadrigalInTheMoment: CharacterCard = {
  id: "xh0",
  cardType: "character",
  name: "Isabela Madrigal",
  version: "In the Moment",
  fullName: "Isabela Madrigal - In the Moment",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "007",
  text: "I'M TIRED OF PERFECT Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 4,
  cardNumber: 25,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "78a3743253e0c1d99573f5b0580092912919c335",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverOneOfYourCharactersSings } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const isabelaMadrigalInTheMoment: LorcanitoCharacterCard = {
//   id: "z6d",
//   name: "Isabela Madrigal",
//   title: "In the Moment",
//   characteristics: ["dreamborn", "ally", "madrigal"],
//   text: "I'M TIRED OF PERFECT Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
//   type: "character",
//   abilities: [
//     wheneverOneOfYourCharactersSings({
//       name: "IM TIRED OF PERFECT",
//       text: "Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
//       effects: [
//         {
//           type: "restriction",
//           restriction: "be-challenged",
//           duration: "next_turn",
//           until: true,
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 5,
//   strength: 3,
//   willpower: 3,
//   illustrator: "César Vergara",
//   number: 25,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619420,
//   },
//   rarity: "rare",
//   lore: 4,
// };
//
