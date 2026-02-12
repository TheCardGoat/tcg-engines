// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   CardEffectTarget,
//   LorcanitoItemCard,
// } from "@lorcanito/lorcana-engine";
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { topCardOfYourDeck } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { RevealTopCardEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Const puppyCharacter: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "type", value: "character" },
//     { filter: "owner", value: "self" },
//     { filter: "characteristics", value: ["puppy"] },
//   ],
// };
//
// Const revealTopPuppyAndPutIntoHand: RevealTopCardEffect = {
//   Type: "reveal-top-card",
//   Target: puppyCharacter,
//   OnTargetMatchEffects: [
//     {
//       Type: "move",
//       To: "hand",
//       ShouldRevealMoved: true,
//       Target: topCardOfYourDeck,
//     },
//   ],
//   OnTargetMatchFailureEffects: [
//     {
//       Type: "move",
//       To: "deck",
//       Bottom: true,
//       Target: topCardOfYourDeck,
//     },
//   ],
// };
//
// Const isItOnYet: ActivatedAbility = {
//   Type: "activated",
//   Name: "IS IT ON YET?",
//   Text: "{E}, 1 {I} – Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.",
//   Costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//   Effects: [revealTopPuppyAndPutIntoHand],
// };
//
// Export const televisionSet: LorcanitoItemCard = {
//   Id: "kqe",
//   Name: "Television Set",
//   Characteristics: ["item"],
//   Text: "IS IT ON YET? {E}, 1 {I} – Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.",
//   Type: "item",
//   Abilities: [isItOnYet],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Illustrator: "Mariana Moreno",
//   Number: 178,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631686,
//   },
//   Rarity: "common",
// };
//
