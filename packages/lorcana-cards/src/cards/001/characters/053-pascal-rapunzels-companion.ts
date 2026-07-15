import type { CharacterCard } from "@tcg/lorcana-types";

export const pascalRapunzelsCompanion: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1f9-1",
      name: "CAMOUFLAGE",
      text: "CAMOUFLAGE While you have another character in play, this character gains Evasive.",
      type: "static",
    },
  ],
  cardNumber: 53,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "b814a14e2ffdfc65f2f3431f069419dede125422",
  },
  franchise: "Tangled",
  fullName: "Pascal - Rapunzel’s Companion",
  id: "1f9",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Pascal",
  set: "001",
  strength: 1,
  text: "CAMOUFLAGE While you have another character in play, this character gains Evasive. (Only characters with Evasive can challenge them.)",
  version: "Rapunzel’s Companion",
  willpower: 1,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const pascalRapunzelCompanion: LorcanitoCharacterCard = {
//   Id: "c2y",
//   Name: "Pascal",
//   Title: "Rapunzel's Companion",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**CAMOUFLAGE** While you have another character in play, this character gains **Evasive**. _(Only characters\rwith Evasive can challenge them.)_",
//   Type: "character",
//   Abilities: [
//     WhileConditionThisCharacterGains({
//       Name: "Camouflage",
//       Text: "While you have another character in play, this character gains **Evasive**. _(Only characters\rwith Evasive can challenge them.)_",
//       Ability: evasiveAbility,
//       Conditions: [
//         {
//           Type: "not-alone",
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "A true friend is always there for you, whether you can\rsee them or not.",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 1,
//   Strength: 1,
//   Willpower: 1,
//   Lore: 1,
//   Illustrator: "Brian Weisz",
//   Number: 53,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 493488,
//   },
//   Rarity: "uncommon",
// };
//
