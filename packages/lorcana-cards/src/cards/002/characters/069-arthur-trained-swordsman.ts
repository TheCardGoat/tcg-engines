import type { CharacterCard } from "@tcg/lorcana-types";

export const arthurTrainedSwordsman: CharacterCard = {
  id: "1ml",
  cardType: "character",
  name: "Arthur",
  version: "Trained Swordsman",
  fullName: "Arthur - Trained Swordsman",
  inkType: ["emerald"],
  franchise: "Sword in the Stone",
  set: "002",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 69,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "d2888dc6ffaf923bdccfa8bb2bfa6bf18d6530ab",
  },
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const arthurTrainedSwordsman: LorcanitoCharacterCard = {
//   id: "ekd",
//
//   name: "Arthur",
//   title: "Trained Swordsman",
//   characteristics: ["hero", "dreamborn"],
//   type: "character",
//   flavour:
//     "It's not just fancy horses and swinging a sword around, you know! A true master must use his brain as well as his blade.\n−Merlin",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Mario Oscar Gabriele",
//   number: 69,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527744,
//   },
//   rarity: "common",
// };
//
