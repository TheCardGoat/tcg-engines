// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   Type GainAbilityStaticAbility,
//   ResistAbility,
//   Type StaticAbility,
//   ShiftAbility,
//   VoicelessAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { opposingCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Const piratesGainsResist: GainAbilityStaticAbility = {
//   Type: "static",
//   Ability: "gain-ability",
//   Name: "FRIGHTFUL SCHEME",
//   Text: "While this character is exerted, Your Pirate characters gain Resist +1.",
//   Conditions: [{ type: "exerted" }],
//   GainedAbility: resistAbility(1),
//   Target: {
//     Type: "card",
//     Value: "all",
//     Filters: [
//       { filter: "owner", value: "self" },
//       { filter: "type", value: "character" },
//       { filter: "zone", value: "play" },
//       { filter: "characteristics", value: ["pirate"] },
//     ],
//   },
// };
// Const frightfulSchemeAbility: StaticAbility[] = [
//   {
//     Type: "static",
//     Ability: "gain-ability",
//     Name: "FRIGHTFUL SCHEME",
//     Text: "While this character is exerted, opposing characters can't exert to sing songs",
//     Conditions: [{ type: "exerted" }],
//     Target: opposingCharacters,
//     GainedAbility: voicelessAbility,
//   },
//   PiratesGainsResist,
// ];
//
// Export const peteSpacePirate: LorcanitoCharacterCard = {
//   Id: "be5",
//   Name: "Pete",
//   Title: "Space Pirate",
//   Characteristics: ["floodborn", "villain", "pirate"],
//   Text: "Shift 4\nFRIGHTFUL SCHEME While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1. (Damage dealt to them is reduced by 1.)",
//   Type: "character",
//   Abilities: [shiftAbility(4, "Pete"), ...frightfulSchemeAbility],
//   Inkwell: true,
//   Colors: ["emerald", "steel"],
//   Cost: 6,
//   Strength: 5,
//   Willpower: 5,
//   Illustrator: "Kenneth Anderson",
//   Number: 114,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 619468,
//   },
//   Rarity: "super_rare",
//   Lore: 2,
// };
//
