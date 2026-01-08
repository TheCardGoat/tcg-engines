import type { ActionCard } from "@tcg/lorcana-types";

export const theMobSong: ActionCard = {
  id: "g30",
  cardType: "action",
  name: "The Mob Song",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "Sing Together 10 Deal 3 damage to up to 3 chosen characters and/or locations.",
  actionSubtype: "song",
  cost: 10,
  cardNumber: 202,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "39f7d10f346a5d4cfce7f3ea92434317a4b05178",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { theMobSong as ogTheMobSong } from "@lorcanito/lorcana-engine/cards/004/actions/198-the-mob-song";
//
// export const theMobSong: LorcanitoActionCard = {
//   ...ogTheMobSong,
//   id: "fj5",
//   reprints: [ogTheMobSong.id],
//   number: 202,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650134,
//   },
// };
//
