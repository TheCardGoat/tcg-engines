import type { ItemCard } from "@tcg/lorcana-types";

export const theSwordOfHercules: ItemCard = {
  id: "1lh",
  cardType: "item",
  name: "The Sword of Hercules",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "010",
  text: "MIGHTY HIT When you play this item, banish chosen opposing Deity character.\nHAND-TO-HAND During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.",
  cost: 2,
  cardNumber: 200,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ce8c06184aecd9b40e1fa325b986a0ea65d8f187",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   LorcanitoItemCard,
// } from "@lorcanito/lorcana-engine";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { wheneverOpposingCharIsBanishedInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// // Custom target for opposing Deity characters
// const chosenOpposingDeityCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//     { filter: "owner", value: "opponent" },
//     { filter: "characteristics", value: ["deity"] },
//   ],
// };
//
// export const theSwordOfHercules: LorcanitoItemCard = {
//   id: "u38",
//   name: "The Sword of Hercules",
//   characteristics: ["item"],
//   text: "MIGHTY HIT When you play this item, banish chosen opposing Deity character. HAND-TO-HAND During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.",
//   type: "item",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Kamil Murzyn",
//   number: 200,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659425,
//   },
//   rarity: "rare",
//   abilities: [
//     whenYouPlayThis({
//       name: "MIGHTY HIT",
//       text: "When you play this item, banish chosen opposing Deity character.",
//       effects: [
//         {
//           type: "banish",
//           target: chosenOpposingDeityCharacter,
//         },
//       ],
//     }),
//     wheneverOpposingCharIsBanishedInChallenge({
//       text: "During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.",
//       name: "HAND-TO-HAND",
//       conditions: [duringYourTurn],
//       effects: [youGainLore(1)],
//     }),
//   ],
// };
//
