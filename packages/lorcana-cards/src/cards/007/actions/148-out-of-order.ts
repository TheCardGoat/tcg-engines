import type { ActionCard } from "@tcg/lorcana-types";

export const outOfOrder: ActionCard = {
  id: "155",
  cardType: "action",
  name: "Out of Order",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "Banish chosen character.",
  cost: 7,
  cardNumber: 148,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "940eb941273724b043f6118b17a05f669488de72",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { outOfOrderAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const outOfOrder: LorcanitoActionCard = {
//   id: "hvy",
//   name: "Out Of Order",
//   characteristics: ["action"],
//   text: "Banish chosen character.",
//   type: "action",
//   abilities: [outOfOrderAbility],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 7,
//   illustrator: "Hedvig H.S",
//   number: 148,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619491,
//   },
//   rarity: "common",
// };
//
