// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import {
//   opponentDiscardsACard,
//   opponentRevealHand,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const goldieOgiltCunningProspector: LorcanitoCharacterCard = {
//   id: "o5c",
//   name: "Goldie O'gilt",
//   title: "Cunning Prospector",
//   characteristics: ["storyborn"],
//   text: "CLAIM JUMPER When you play this character, chosen opponent reveals their hand and discards a location card of your choice.\nSTRIKE GOLD Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Jiahui Eva Gao",
//   number: 87,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658880,
//   },
//   rarity: "rare",
//   abilities: [
//     whenYouPlayThis({
//       name: "CLAIM JUMPER",
//       text: "When you play this character, chosen opponent reveals their hand and discards a location card of your choice.",
//       resolveEffectsIndividually: true,
//       effects: [
//         opponentRevealHand,
//         opponentDiscardsACard([{ filter: "type", value: "location" }]),
//       ],
//     }),
//     wheneverThisCharacterQuests({
//       name: "STRIKE GOLD",
//       text: "Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "deck",
//           bottom: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "location" },
//               { filter: "zone", value: "discard" },
//             ],
//           },
//           forEach: [
//             {
//               type: "lore",
//               amount: 1,
//               modifier: "add",
//               target: self,
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
