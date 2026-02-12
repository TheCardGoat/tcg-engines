// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   Type GainAbilityStaticAbility,
//   ShiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   OpposingCharacters,
//   ThisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverIsExerted } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { banishThisCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const ancientRage: GainAbilityStaticAbility = {
//   Type: "static",
//   Ability: "gain-ability",
//   Name: "ANCIENT RAGE",
//   Text: "During your turn, whenever an opposing character is exerted, banish them.",
//   Conditions: [{ type: "during-turn", value: "self" }],
//   Target: opposingCharacters,
//   GainedAbility: wheneverIsExerted({
//     Name: "ANCIENT RAGE",
//     Text: "During your turn, whenever an opposing character is exerted, banish them.",
//     Target: thisCharacter,
//     Effects: [banishThisCharacter],
//   }),
// };
// Export const teKaElementalTerror: LorcanitoCharacterCard = {
//   Id: "g0z",
//   Name: "Te Kā",
//   Title: "Elemental Terror",
//   Characteristics: ["floodborn", "villain", "deity"],
//   Text: "Shift 7\nANCIENT RAGE During your turn, whenever an opposing character is exerted, banish them.",
//   Type: "character",
//   Abilities: [shiftAbility(7, "Te Kā"), ancientRage],
//   Inkwell: true,
//
//   Colors: ["amethyst", "ruby"],
//   Cost: 10,
//   Strength: 12,
//   Willpower: 12,
//   Illustrator: "Nicola Savioli",
//   Number: 54,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 618257,
//   },
//   Rarity: "super_rare",
//   Lore: 3,
// };
//
