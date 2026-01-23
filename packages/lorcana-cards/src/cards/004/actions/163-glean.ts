import type { ActionCard } from "@tcg/lorcana-types";

export const glean: ActionCard = {
  id: "wm3",
  cardType: "action",
  name: "Glean",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "Banish chosen item. Its player gains 2 lore.",
  cost: 1,
  cardNumber: 163,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "758b111d188a6788401552ca32e2c72ad9d31998",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenItem } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const glean: LorcanitoActionCard = {
//   id: "aqx",
//   name: "Glean",
//   characteristics: ["action"],
//   text: "Banish chosen item. Its owner gains 2 lore.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Glean",
//       text: "Banish chosen item. Its owner gains 2 lore.",
//       effects: [
//         {
//           type: "banish",
//           target: chosenItem,
//         },
//         {
//           type: "lore",
//           amount: 2,
//           modifier: "add",
//           target: { type: "player", value: "target_owner" },
//         },
//       ],
//     },
//   ],
//   flavour: "This could be just the thing I need to get my invention working.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
//   number: 163,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550614,
//   },
//   rarity: "common",
// };
//
