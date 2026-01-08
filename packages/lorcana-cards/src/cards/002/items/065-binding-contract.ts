import type { ItemCard } from "@tcg/lorcana-types";

export const bindingContract: ItemCard = {
  id: "1j7",
  cardType: "item",
  name: "Binding Contract",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "002",
  text: "FOR ALL ETERNITY {E}, {E} one of your characters — Exert chosen character.",
  cost: 4,
  cardNumber: 65,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c8a9fbe523de9f6033b437c8c17e08db0304f135",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { exertCharCost } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//   ],
// };
//
// export const bindingContract: LorcanitoItemCard = {
//   id: "n9a",
//
//   name: "Binding Contract",
//   characteristics: ["item"],
//   text: "**FOR ALL ETERNITY** {E}, {E} one of your characters − Exert chosen character.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "For All Eternity",
//       text: "{E}, {E} one of your characters − Exert chosen character.",
//       costs: [{ type: "exert" }, exertCharCost(1)],
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "Just a standard form, nothing to worry about.",
//   colors: ["amethyst"],
//   cost: 4,
//   illustrator: "Kasia Brzezinska",
//   number: 65,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527740,
//   },
//   rarity: "uncommon",
// };
//
