import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanReflecting: CharacterCard = {
  id: "1ox",
  cardType: "character",
  name: "Mulan",
  version: "Reflecting",
  fullName: "Mulan - Reflecting",
  inkType: ["amber"],
  franchise: "Mulan",
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Mulan.)\nHONOR TO THE ANCESTORS Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 16,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dba0b0c949ec8f04e71f20cf8f771c414b558411",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const mulanReflecting: LorcanitoCharacterCard = {
//   id: "jat",
//   name: "Mulan",
//   title: "Reflecting",
//   characteristics: ["hero", "floodborn", "princess"],
//   text: "**Shift** 2 (_You may pay 2 {I} to play this on top of one of your characters named Mulan._)\n\n**HONOR TO THE ANCESTORS** Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Honor To The Ancestors",
//       text: "Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.",
//       effects: [
//         {
//           type: "reveal-and-play",
//           putInto: "deck",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "action" },
//               { filter: "characteristics", value: ["song"] },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//     shiftAbility(2, "mulan"),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Lissette Carrera",
//   number: 16,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525083,
//   },
//   rarity: "rare",
// };
//
