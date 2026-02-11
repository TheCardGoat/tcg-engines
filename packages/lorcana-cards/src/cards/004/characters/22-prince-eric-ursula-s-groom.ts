// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   BodyguardAbility,
//   ShiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import {
//   WhileYouHaveACharacterNamedThisCharGains,
//   WhileYouHaveACharacterNamedThisCharGets,
// } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// Export const princeEricUrsulasGroom: LorcanitoCharacterCard = {
//   Id: "k1b",
//   MissingTestCase: true,
//   Name: "Prince Eric",
//   Title: "Ursula's Groom",
//   Characteristics: ["hero", "floodborn", "prince"],
//   Text: "**Shift 4** _(You may pay 4 {I} to play this on top of one of your characters named Prince Eric.)**\n\n\n**UNDER VANESSA'S SPELL** While you have a character named Ursula in play, this character gains **Bodyguard** and gets +2 {W}. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(4, "prince eric"),
//     WhileYouHaveACharacterNamedThisCharGains({
//       Name: "Under Vanessa's Spell",
//       Text: "While you have a character named Ursula in play, this character gains **Bodyguard**.",
//       CharacterName: "Ursula",
//       Ability: bodyguardAbility,
//     }),
//     WhileYouHaveACharacterNamedThisCharGets({
//       Name: "Under Vanessa's Spell",
//       Text: "While you have a character named Ursula in play, this character gets +2 {W}.",
//       CharacterName: "Ursula",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "willpower",
//           Amount: 2,
//           Modifier: "add",
//           Target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 6,
//   Strength: 5,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Lisanne Koeteeuw",
//   Number: 22,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 550561,
//   },
//   Rarity: "uncommon",
// };
//
