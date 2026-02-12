import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraDreamingGuardian: CharacterCard = {
  abilities: [
    {
      cost: { ink: 3 },
      id: "wb5-1",
      keyword: "Shift",
      text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Aurora._)",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
      id: "wb5-2",
      text: "**Protective Embrace** Your other characters gain **Ward**. _(Opponents can",
      type: "static",
    },
  ],
  cardNumber: 139,
  cardType: "character",
  classifications: ["Hero", "Floodborn", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Aurora - Dreaming Guardian",
  id: "wb5",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  name: "Aurora",
  set: "001",
  strength: 3,
  text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Aurora._)\n**Protective Embrace** Your other characters gain **Ward**. _(Opponents can",
  version: "Dreaming Guardian",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   ShiftAbility,
//   WardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const auroraDreamingGuardian: LorcanitoCharacterCard = {
//   Id: "wb5",
//   Reprints: ["kjf"],
//
//   Name: "Aurora",
//   Title: "Dreaming Guardian",
//   Characteristics: ["hero", "floodborn", "princess"],
//   Text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Aurora._)\n**Protective Embrace** Your other characters gain **Ward**. _(Opponents can't choose them except to challenge.)_",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "gain-ability",
//       Name: "Protective Embrace",
//       Text: "Your other characters gain **Ward**. _(Opponents can't choose them except to challenge.)_",
//       GainedAbility: wardAbility,
//       Target: {
//         Type: "card",
//         Value: "all",
//         ExcludeSelf: true,
//         Filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//     },
//     ShiftAbility(3, "Aurora"),
//   ],
//   Flavour: "As the princess slumbered, her power awoke.",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 5,
//   Strength: 3,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Nicholas Kole",
//   Number: 139,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 493497,
//   },
//   Rarity: "super_rare",
// };
//
