import type { ActionCard } from "@tcg/lorcana-types";

export const i2i: ActionCard = {
  id: "14j",
  cardType: "action",
  name: "I2I",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  text: "Sing Together 9 Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.",
  actionSubtype: "song",
  cost: 9,
  cardNumber: 130,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9106ad9e4c47dedfb11165c78dafa1099067fe04",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { xOrMoreCharsSangThisSongCondition } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   drawXCards,
//   readyAndCantQuest,
// } from "@lorcanito/lorcana-engine/effects/effects";
// import type { CreateLayerBasedOnCondition } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const conditionalEffects: CreateLayerBasedOnCondition = {
//   type: "create-layer-based-on-condition",
//   // TODO: Target not needed
//   target: self,
//   conditionalEffects: [
//     {
//       conditions: [xOrMoreCharsSangThisSongCondition(2)],
//       effects: readyAndCantQuest({
//         type: "card",
//         value: "all",
//         filters: [{ filter: "sing", value: "singer" }],
//       }),
//     },
//   ],
// };
//
// export const i2i: LorcanitoActionCard = {
//   id: "e90",
//   name: "I2I",
//   characteristics: ["action", "song"],
//   text: "Sing Together 9 (Any number of your or your teammates’ characters with total cost 9 or more may {E} to sing this song for free.)\nEach player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.",
//   type: "action",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 9,
//   illustrator: "Erin Whelil",
//   number: 130,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650065,
//   },
//   rarity: "rare",
//   abilities: [
//     singerTogetherAbility(9),
//     {
//       type: "resolution",
//       text: "Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.",
//       effects: [
//         {
//           type: "lore",
//           modifier: "add",
//           amount: 2,
//           target: { type: "player", value: "self" },
//         },
//         {
//           type: "lore",
//           modifier: "add",
//           amount: 2,
//           target: { type: "player", value: "opponent" },
//         },
//         drawXCards(2, self),
//         drawXCards(2, opponent),
//         conditionalEffects,
//       ],
//     },
//   ],
// };
//
