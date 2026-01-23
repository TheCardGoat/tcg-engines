import type { ActionCard } from "@tcg/lorcana-types";

export const healWhatHasBeenHurt: ActionCard = {
  id: "1mx",
  cardType: "action",
  name: "Heal What Has Been Hurt",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "009",
  text: "Remove up to 3 damage from chosen character. Draw a card.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 27,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d45af62e889fec250e32e95abea7832ebf5ac8c3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { healWhatHasBeenHurt as ogHealWhatHasBeenHurt } from "@lorcanito/lorcana-engine/cards/003/actions/026-heal-what-has-been-hurt";
//
// export const healWhatHasBeenHurt: LorcanitoActionCard = {
//   ...ogHealWhatHasBeenHurt,
//   id: "z47",
//   reprints: [ogHealWhatHasBeenHurt.id],
//   number: 27,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649974,
//   },
// };
//
