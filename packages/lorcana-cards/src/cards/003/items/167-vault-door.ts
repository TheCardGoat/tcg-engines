import type { ItemCard } from "@tcg/lorcana-types";

export const vaultDoor: ItemCard = {
  id: "1nn",
  cardType: "item",
  name: "Vault Door",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  text: "SEALED AWAY Your locations and characters at locations gain Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 4,
  cardNumber: 167,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d4e40d3f6a1cb410ae20b81b5ccb4c8c6304b4ad",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const vaultDoor: LorcanitoItemCard = {
//   id: "doz",
//   name: "Vault Door",
//   characteristics: ["item"],
//   text: "**SEALED AWAY** Your locations and character at locations gain **Resist** +1. _(Damage dealt to them is reduced by 1.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Sealed Away",
//       text: "Your locations and character at locations gain **Resist** +1",
//       gainedAbility: resistAbility(1),
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           {
//             filter: "type",
//             value: "location",
//           },
//           { filter: "owner", value: "self" },
//         ],
//       },
//     },
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Sealed Away",
//       text: "Your locations and character at locations gain **Resist** +1",
//       gainedAbility: resistAbility(1),
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "owner", value: "self" },
//           {
//             filter: "type",
//             value: "character",
//           },
//           {
//             filter: "status",
//             value: "at-location",
//           },
//         ],
//       },
//     },
//   ],
//   flavour:
//     "Only Scrooge knows about this vault. And he's going to keep it that way.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   illustrator: "Nicolas Ky",
//   number: 167,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537394,
//   },
//   rarity: "common",
// };
//
