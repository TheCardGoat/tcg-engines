import type { ItemCard } from "@tcg/lorcana-types";

export const sardineCan: ItemCard = {
  id: "2oi",
  cardType: "item",
  name: "Sardine Can",
  inkType: ["sapphire"],
  franchise: "Rescuers",
  set: "002",
  text: "FLIGHT CABIN Your exerted characters gain Ward. (Opponents can't choose them except to challenge.)",
  cost: 4,
  cardNumber: 170,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "09a95b1575fe35eec08ad5e0dce576e221bcff9d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { GainAbilityStaticAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const sardineCan: LorcanitoItemCard = {
//   id: "sdr",
//
//   name: "Sardine Can",
//   characteristics: ["item"],
//   text: "**FLIGHT CABIN** Your exerted characters gain **Ward**. _(Opponents can't choose them except to challenge.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Flight Cabin",
//       text: "Your exerted characters gain **Ward**.",
//       gainedAbility: wardAbility,
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "status", value: "exerted" },
//         ],
//       },
//     } as GainAbilityStaticAbility,
//   ],
//   flavour: "Flight 3759 boarding now! Let's go get that lore! \n–Orville",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   illustrator: "Peter Brockhammer",
//   number: 170,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527771,
//   },
//   rarity: "uncommon",
// };
//
