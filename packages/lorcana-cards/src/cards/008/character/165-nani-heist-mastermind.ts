// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   Type ActivatedAbility,
//   SupportAbility,
//   YourCharactersNamedGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { chosenCharacterGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const naniHeistMastermind: LorcanitoCharacterCard = {
//   Id: "z0x",
//   Name: "Nani",
//   Title: "Heist Mastermind",
//   Characteristics: ["storyborn", "hero"],
//   Text: "STICK TO THE PLAN {E} – Another chosen character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\nIT'S UP TO YOU, LILO Your characters named Lilo gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "STICK TO THE PLAN",
//       Text: "Another chosen character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
//       Costs: [{ type: "exert" }],
//       Responder: "self",
//       Effects: [chosenCharacterGainsResist(2)],
//     } as ActivatedAbility,
//     YourCharactersNamedGain({
//       Name: "Lilo",
//       Ability: supportAbility,
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Illustrator: "Alex Accorsi",
//   Number: 165,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631462,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
