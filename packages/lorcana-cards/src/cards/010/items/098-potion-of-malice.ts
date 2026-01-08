import type { ItemCard } from "@tcg/lorcana-types";

export const potionOfMalice: ItemCard = {
  id: "ifu",
  cardType: "item",
  name: "Potion of Malice",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "010",
  text: "SUPPRESSED ANGER {E}, 1 {I} — Put 1 damage counter on chosen character.\nMINDLESS RAGE {E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  cardNumber: 98,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4275816cdbb9f9296a32c10b96da37cf137ddb75",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { putDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// const chosenCharacter = {
//   type: "card" as const,
//   value: 1,
//   filters: [
//     { filter: "zone" as const, value: "play" as const },
//     { filter: "type" as const, value: "character" as const },
//   ],
// };
//
// export const potionOfMalice: LorcanitoItemCard = {
//   id: "nhx",
//   name: "Potion Of Malice",
//   characteristics: ["item"],
//   text: "**SUPPRESSED ANGER** {E}, 1 {I} – Put 1 damage counter on chosen character.\n**MINDLESS RAGE** {E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
//   type: "item",
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Nicolas Ky",
//   number: 98,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658785,
//   },
//   rarity: "super_rare",
//   abilities: [
//     {
//       type: "activated",
//       name: "Suppressed Anger",
//       text: "{E}, 1 {I} – Put 1 damage counter on chosen character.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       effects: [putDamageEffect(1, chosenCharacter)],
//     },
//     {
//       type: "activated",
//       name: "Mindless Rage",
//       text: "{E}, Banish this item – Each opposing damaged character gains Reckless until the start of your next turn.",
//       costs: [{ type: "exert" }, { type: "banish" }],
//       effects: [
//         {
//           type: "ability",
//           ability: "reckless",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "opponent" },
//               { filter: "status", value: "damaged" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
