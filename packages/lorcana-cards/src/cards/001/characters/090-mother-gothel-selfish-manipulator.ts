import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelSelfishManipulator: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
      id: "xse-1",
      name: "SKIP THE DRAMA, STAY WITH MAMA",
      text: "SKIP THE DRAMA, STAY WITH MAMA While this character is exerted, opposing characters can't quest.",
      type: "static",
    },
  ],
  cardNumber: 90,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 6,
  externalIds: {
    ravensburger: "79c6e202cddc31d783bd416c273e9fed9f7a7eb2",
  },
  franchise: "Tangled",
  fullName: "Mother Gothel - Selfish Manipulator",
  id: "xse",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  name: "Mother Gothel",
  set: "001",
  strength: 3,
  text: "SKIP THE DRAMA, STAY WITH MAMA While this character is exerted, opposing characters can't quest.",
  version: "Selfish Manipulator",
  willpower: 6,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   OpposingCharacters,
//   ThisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whileConditionOnThisCharacterTargetsGain } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const motherGoethelSelfishManipulator: LorcanitoCharacterCard = {
//   Id: "opl",
//   Name: "Mother Gothel",
//   Title: "Selfish Manipulator",
//   Characteristics: ["storyborn", "villain"],
//   Text: "**SKIP THE DRAMA, STAY WITH MAMA** While this character is exerted, opposing character can't quest.",
//   Type: "character",
//   Illustrator: "Javier Salas",
//   Abilities: [
//     WhileConditionOnThisCharacterTargetsGain({
//       Name: "Skip the Drama, Stay with Mama",
//       Text: "While this character is exerted, opposing character can't quest.",
//       Conditions: [{ type: "exerted" }],
//       Target: opposingCharacters,
//       Ability: {
//         Type: "static",
//         Ability: "effects",
//         Target: thisCharacter,
//         Effects: [
//           {
//             Type: "restriction",
//             Restriction: "quest",
//             Duration: "static",
//             Target: opposingCharacters,
//           },
//         ],
//       },
//     }),
//   ],
//   Flavour: "Great. Now I'm the bad guy.",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 6,
//   Strength: 3,
//   Willpower: 6,
//   Lore: 2,
//   Number: 90,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508772,
//   },
//   Rarity: "super_rare",
// };
//
