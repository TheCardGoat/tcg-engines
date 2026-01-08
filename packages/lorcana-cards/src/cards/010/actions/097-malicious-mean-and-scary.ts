import type { ActionCard } from "@tcg/lorcana-types";

export const maliciousMeanAndScary: ActionCard = {
  id: "bxn",
  cardType: "action",
  name: "Malicious, Mean, and Scary",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  text: "Put 1 damage counter on each opposing character.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 97,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2b0362a22d7027775ae69d67c87d57d5b1b64be3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { eachOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { putDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const maliciousMeanAndScary: LorcanitoActionCard = {
//   id: "dat",
//   name: "Malicious, Mean, and Scary",
//   characteristics: ["action", "song"],
//   text: "Put 1 damage counter on each opposing character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [putDamageEffect(1, eachOpposingCharacter)],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Marcelo Vignali",
//   number: 97,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659188,
//   },
//   rarity: "uncommon",
// };
//
