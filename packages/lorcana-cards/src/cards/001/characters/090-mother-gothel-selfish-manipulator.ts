import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelSelfishManipulator: CharacterCard = {
  id: "xse",
  cardType: "character",
  name: "Mother Gothel",
  version: "Selfish Manipulator",
  fullName: "Mother Gothel - Selfish Manipulator",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "001",
  text: "SKIP THE DRAMA, STAY WITH MAMA While this character is exerted, opposing characters can't quest.",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 90,
  inkable: true,
  externalIds: {
    ravensburger: "79c6e202cddc31d783bd416c273e9fed9f7a7eb2",
  },
  abilities: [
    {
      id: "xse-1",
      text: "SKIP THE DRAMA, STAY WITH MAMA While this character is exerted, opposing characters can't quest.",
      name: "SKIP THE DRAMA, STAY WITH MAMA",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
    },
  ],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   opposingCharacters,
//   thisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionOnThisCharacterTargetsGain } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const motherGoethelSelfishManipulator: LorcanitoCharacterCard = {
//   id: "opl",
//   name: "Mother Gothel",
//   title: "Selfish Manipulator",
//   characteristics: ["storyborn", "villain"],
//   text: "**SKIP THE DRAMA, STAY WITH MAMA** While this character is exerted, opposing character can't quest.",
//   type: "character",
//   illustrator: "Javier Salas",
//   abilities: [
//     whileConditionOnThisCharacterTargetsGain({
//       name: "Skip the Drama, Stay with Mama",
//       text: "While this character is exerted, opposing character can't quest.",
//       conditions: [{ type: "exerted" }],
//       target: opposingCharacters,
//       ability: {
//         type: "static",
//         ability: "effects",
//         target: thisCharacter,
//         effects: [
//           {
//             type: "restriction",
//             restriction: "quest",
//             duration: "static",
//             target: opposingCharacters,
//           },
//         ],
//       },
//     }),
//   ],
//   flavour: "Great. Now I'm the bad guy.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 3,
//   willpower: 6,
//   lore: 2,
//   number: 90,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508772,
//   },
//   rarity: "super_rare",
// };
//
