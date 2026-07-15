import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookForcefulDuelist: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "uk5-1",
      text: "**Challenger** +2 (_While challenging, this character get +2 {S}._)",
      type: "static",
    },
  ],
  cardNumber: 174,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
  cost: 1,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Captain Hook - Forceful Duelist",
  id: "uk5",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Captain Hook",
  set: "001",
  strength: 1,
  text: "**Challenger** +2 (_While challenging, this character get +2 {S}._)",
  version: "Forceful Duelist",
  willpower: 2,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ChallengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const captainHookForcefulDuelist: LorcanitoCharacterCard = {
//   Id: "uk5",
//   Reprints: ["whb"],
//   Name: "Captain Hook",
//   Title: "Forceful Duelist",
//   Characteristics: ["dreamborn", "villain", "pirate", "captain"],
//   Text: "**Challenger** +2 (_While challenging, this character get +2 {S}._)",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "challenger",
//       Value: 2,
//       Text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
//     } as ChallengerAbility,
//   ],
//   Flavour: "He loves to make light of a foe's predicament.",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 1,
//   Strength: 1,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Marcel Berg",
//   Number: 174,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492704,
//   },
//   Rarity: "common",
// };
//
