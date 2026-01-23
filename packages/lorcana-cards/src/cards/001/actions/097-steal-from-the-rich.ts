import type { ActionCard } from "@tcg/lorcana-types";
import { wheneverQuest } from "../../ability-helpers";

export const stealFromTheRich: ActionCard = {
  id: "ncz",
  cardType: "action",
  name: "Steal from the Rich",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "001",
  text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
  cost: 5,
  cardNumber: 97,
  inkable: false,
  externalIds: {
    ravensburger: "54317280fda3eec0bfe9a09946029a6334cadaf3",
  },
  abilities: [
    wheneverQuest("ncz-1", {
      text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
      on: "YOUR_CHARACTERS",
      then: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    }),
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { Trigger } from "@lorcanito/lorcana-engine";
// import type { FloatingTriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { LoreEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const stealFromRich: LorcanitoActionCard = {
//   id: "wje",
//   name: "Steal from the Rich",
//   characteristics: ["action"],
//   text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
//   type: "action",
//   abilities: [
//     {
//       type: "floating-triggered",
//       duration: "turn",
//       trigger: {
//         on: "quest",
//         target: {
//           type: "card",
//           value: "all",
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//             { filter: "type", value: "character" },
//           ],
//         },
//       } as Trigger,
//       layer: {
//         type: "resolution",
//         effects: [
//           {
//             type: "lore",
//             amount: 1,
//             modifier: "subtract",
//             target: {
//               type: "player",
//               value: "opponent",
//             },
//           } as LoreEffect,
//         ],
//       },
//     } as FloatingTriggeredAbility,
//   ],
//   flavour:
//     "Wonder how much ol' Prince John spent on all those fancy locks. \n−Little John",
//   colors: ["emerald"],
//   cost: 5,
//   illustrator: "Hedvig Häggman-Sund",
//   number: 97,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508773,
//   },
//   rarity: "rare",
// };
//
