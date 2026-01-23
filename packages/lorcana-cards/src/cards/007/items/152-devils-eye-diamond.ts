import type { ItemCard } from "@tcg/lorcana-types";

export const devilsEyeDiamond: ItemCard = {
  id: "136",
  cardType: "item",
  name: "Devil's Eye Diamond",
  inkType: ["ruby"],
  franchise: "Rescuers",
  set: "007",
  text: "THE PRICE OF POWER {E} — If one of your characters was damaged this turn, gain 1 lore.",
  cost: 2,
  cardNumber: 152,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8ed363fa97089bc85eafbc80376a5c151fe5edd0",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { devilsEyeDiamondAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const devilsEyeDiamond: LorcanitoItemCard = {
//   id: "b3x",
//   name: "Devil's Eye Diamond",
//   characteristics: ["item"],
//   text: "THE PRICE OF POWER {E} - If one of your characters was damaged this turn, gain 1 lore.",
//   type: "item",
//   abilities: [devilsEyeDiamondAbility],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   illustrator: "Juan Diego Leon",
//   number: 152,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618710,
//   },
//   rarity: "rare",
// };
//
