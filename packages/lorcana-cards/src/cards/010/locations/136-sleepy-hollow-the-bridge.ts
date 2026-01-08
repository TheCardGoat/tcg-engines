import type { LocationCard } from "@tcg/lorcana-types";

export const sleepyHollowTheBridge: LocationCard = {
  id: "z63",
  cardType: "location",
  name: "Sleepy Hollow",
  version: "The Bridge",
  fullName: "Sleepy Hollow - The Bridge",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "HEAD FOR THE BRIDGE! Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 136,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7ec0ca5165f108cb73d1156e881760489fbbf725",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { targetTriggerCard } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverACharacterQuestsWhileHere } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import {
//   mayBanish,
//   theyGainEvasive,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const sleepyHollowTheBridge: LorcanitoLocationCard = {
//   id: "t5z",
//   name: "Sleepy Hollow",
//   title: "The Bridge",
//   characteristics: ["location"],
//   text: "HEAD FOR THE BRIDGE! Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn.",
//   type: "location",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   willpower: 6,
//   illustrator: "Jimmy Lo",
//   number: 136,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660018,
//   },
//   rarity: "uncommon",
//   moveCost: 1,
//   lore: 0,
//   abilities: [
//     wheneverACharacterQuestsWhileHere({
//       name: "HEAD FOR THE BRIDGE!",
//       text: "Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn.",
//       optional: true,
//       effects: [
//         {
//           type: "ability",
//           ability: "evasive",
//           duration: "next_turn",
//           until: true,
//           modifier: "add",
//           target: targetTriggerCard,
//         },
//         youGainLore(2),
//         mayBanish({
//           type: "card",
//           value: "all",
//           filters: [
//             {
//               filter: "location",
//               value: "source",
//             },
//           ],
//         }),
//       ],
//     }),
//   ],
// };
//
