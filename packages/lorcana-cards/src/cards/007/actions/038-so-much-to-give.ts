import type { ActionCard } from "@tcg/lorcana-types";

export const soMuchToGive: ActionCard = {
  id: "jyr",
  cardType: "action",
  name: "So Much to Give",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "007",
  text: "Draw a card. Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 38,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "47f551a402c331ac81e1b4f502c282a9cdb4dc34",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { soMuchToGiveAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const soMuchToGive: LorcanitoActionCard = {
//   id: "qi0",
//   name: "So Much To Give",
//   characteristics: ["song", "action"],
//   text: "(A character with cost 2 or more can {E} to sing this song for free.)\nDraw a card. Chosen character gains Bodyguard until the start of your next turn.",
//   type: "action",
//   abilities: [soMuchToGiveAbility],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Andrea Femerstrand",
//   number: 38,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618720,
//   },
//   rarity: "common",
// };
//
