import type { ActionCard } from "@tcg/lorcana-types";

export const youCanFly: ActionCard = {
  id: "ojo",
  cardType: "action",
  name: "You Can Fly!",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "009",
  text: "Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 131,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "58776f4069675bc00ffc50d5d4cc8aaf7b95b0fc",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { youCanFly as youCanFlyAsOrig } from "@lorcanito/lorcana-engine/cards/002/actions/133-you-can-fly";
//
// export const youCanFly: LorcanitoActionCard = {
//   ...youCanFlyAsOrig,
//   id: "uv6",
//   reprints: [youCanFlyAsOrig.id],
//   number: 131,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650066,
//   },
// };
//
