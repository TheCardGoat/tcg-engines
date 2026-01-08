import type { CharacterCard } from "@tcg/lorcana-types";

export const belleMechanicExtraordinaire: CharacterCard = {
  id: "lej",
  cardType: "character",
  name: "Belle",
  version: "Mechanic Extraordinaire",
  fullName: "Belle - Mechanic Extraordinaire",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "Shift 7\nSALVAGE For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.\nREPURPOSE Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.",
  cost: 9,
  strength: 7,
  willpower: 7,
  lore: 3,
  cardNumber: 126,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4d23f100a066fd4f3e2360075ccf1959f705f5d7",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const belleMechanicExtraordinaire: LorcanitoCharacterCard = {
//   id: "rdt",
//   name: "Belle",
//   title: "Mechanic Extraordinaire",
//   characteristics: ["floodborn", "hero", "princess", "inventor"],
//   text: "Shift 7\nSALVAGE For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.\nREPURPOSE Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.",
//   type: "character",
//   abilities: [
//     shiftAbility(7, "belle"),
//     {
//       type: "static",
//       name: "SALVAGE",
//       text: "For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.",
//       ability: "effects",
//       effects: [
//         {
//           type: "replacement",
//           replacement: "shift",
//           duration: "next",
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//           target: thisCharacter,
//         },
//       ],
//     },
//     wheneverQuests({
//       name: "REPURPOSE",
//       text: "Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.",
//       effects: [
//         {
//           type: "move",
//           to: "deck",
//           bottom: true,
//           amount: 3,
//           target: {
//             type: "card",
//             value: 3,
//             upTo: true,
//             filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//           forEach: [youGainLore(1)],
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//
//   colors: ["ruby", "sapphire"],
//   cost: 9,
//   strength: 7,
//   willpower: 7,
//   illustrator: "Koni",
//   number: 126,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618263,
//   },
//   rarity: "super_rare",
//   lore: 3,
// };
//
