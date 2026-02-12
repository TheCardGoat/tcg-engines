// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   CardEffectTarget,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// Import {
//   ChosenCharacter,
//   ThisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type {
//   CreateLayerBasedOnTarget,
//   MoveCardEffect,
// } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Const putChosenCharAtTheBottom: CreateLayerBasedOnTarget = {
//   Type: "create-layer-based-on-target",
//   // TODO: get rid of target
//   Target: thisCharacter,
//   Responder: "self",
//   Effects: [
//     {
//       Type: "move",
//       To: "deck",
//       Bottom: true,
//       ShouldRevealMoved: true,
//       Target: chosenCharacter,
//     },
//   ],
// };
//
// Const pullTheLeverFromDiscard: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "zone", value: "discard" },
//     { filter: "owner", value: "self" },
//     {
//       Filter: "publicId",
//       // value: pullTheLever.id,
//       Value: "sp7",
//     },
//   ],
// };
//
// Const putAPullTheLeverFromDiscardToBottom: MoveCardEffect = {
//   Type: "move",
//   To: "deck",
//   Bottom: true,
//   Amount: 1,
//   ShouldRevealMoved: true,
//   Target: pullTheLeverFromDiscard,
//   ForEach: [putChosenCharAtTheBottom],
// };
//
// Export const wrongLeverAction: LorcanitoActionCard = {
//   Id: "g9i",
//   Name: "Wrong Lever!",
//   Characteristics: ["action"],
//   Text: "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 3,
//   Illustrator: "Cristian Romero",
//   Number: 116,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631425,
//   },
//   Rarity: "rare",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "modal",
//           // TODO: Get rid of target
//           Target: chosenCharacter,
//           Modes: [
//             {
//               Id: "1",
//               Text: "Return chosen character to their player's hand.",
//               Effects: [{ type: "move", to: "hand", target: chosenCharacter }],
//             },
//             {
//               Id: "2",
//               Text: "Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
//               Effects: [putAPullTheLeverFromDiscardToBottom],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
//
