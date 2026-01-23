import type { ActionCard } from "@tcg/lorcana-types";

export const divebomb: ActionCard = {
  id: "1ei",
  cardType: "action",
  name: "Divebomb",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "003",
  text: "Banish one of your characters with Reckless to banish chosen character with less {S} than that character.",
  cost: 3,
  cardNumber: 128,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b79271249a893d1000e32bdb11f4305ccf9defd7",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const divebomb: LorcanitoActionCard = {
//   id: "zm8",
//   missingTestCase: true,
//   name: "Divebomb",
//   characteristics: ["action"],
//   text: "Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.",
//       text: "Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.",
//       effects: [],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   illustrator: "Lisanne Koeteeuw",
//   number: 128,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537755,
//   },
//   rarity: "uncommon",
// };
//
