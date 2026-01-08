// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   allYourCharacters,
//   chosenCharacterOfYoursAtLocation,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   readyAndCantQuest,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const iveGotADream: LorcanitoActionCard = {
//   id: "ntx",
//   name: "I've Got a Dream",
//   characteristics: ["action", "song"],
//   text: "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         ...readyAndCantQuest(chosenCharacterOfYoursAtLocation),
//         {
//           type: "create-layer-based-on-target",
//           resolveAmountBeforeCreatingLayer: true,
//           effects: [
//             youGainLore({
//               dynamic: true,
//               targetLocation: { attribute: "lore" },
//             }),
//           ],
//           // TODO: Get rid of target
//           target: allYourCharacters,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "Tor would like to quit and be a florist \nGunther does interior design",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   illustrator: "Cacciatore Michaela",
//   number: 129,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 531825,
//   },
//   rarity: "uncommon",
// };
//
