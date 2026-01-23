import type { ActionCard } from "@tcg/lorcana-types";

export const weDontTalkAboutBruno: ActionCard = {
  id: "3im",
  cardType: "action",
  name: "We Don’t Talk About Bruno",
  inkType: ["emerald"],
  franchise: "Encanto",
  set: "004",
  text: "Return chosen character to their player's hand, then that player discards a card at random.",
  actionSubtype: "song",
  cost: 5,
  cardNumber: 97,
  inkable: true,
  externalIds: {
    ravensburger: "0cad2afabe0d8c82ff3aaacde2c1d2e1edaad12a",
  },
  abilities: [
    {
      id: "3im-1",
      text: "Return chosen character to their player's hand. That player chooses and discards a card.",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
            },
          },
          {
            type: "discard",
            amount: 1,
            target: "CARD_OWNER",
            chosen: true,
          },
        ],
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   thisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const weDontTalkAboutBruno: LorcanitoActionCard = {
//   id: "wwi",
//   name: "We Don't Talk About Bruno",
//   characteristics: ["action", "song"],
//   text: "Return chosen character to their player's hand, then that player discards a card at random.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "We Don't Talk About Bruno",
//       text: "Return chosen character to their player's hand, then that player discards a card at random.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacter,
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               // TODO: get rid of target
//               target: thisCharacter,
//               responder: "target_card_owner",
//               effects: [
//                 {
//                   type: "discard",
//                   amount: 1,
//                   target: {
//                     type: "card",
//                     value: 1,
//                     random: true,
//                     filters: [
//                       { filter: "zone", value: "hand" },
//                       { filter: "owner", value: "self" },
//                     ],
//                   },
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   illustrator: 'Victor "Yano" Covarrubias',
//   number: 97,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 546891,
//   },
//   rarity: "rare",
// };
//
