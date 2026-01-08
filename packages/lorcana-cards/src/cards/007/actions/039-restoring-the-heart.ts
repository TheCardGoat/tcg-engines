import type { ActionCard } from "@tcg/lorcana-types";

export const restoringTheHeart: ActionCard = {
  id: "inl",
  cardType: "action",
  name: "Restoring the Heart",
  inkType: ["amber", "sapphire"],
  franchise: "Moana",
  set: "007",
  text: "Remove up to 3 damage from chosen character or location. Draw a card.",
  cost: 1,
  cardNumber: 39,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "433c65f67c223f90311aefde360c4a70f5b3776e",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { restoringTheHeartAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const restoringTheHeart: LorcanitoActionCard = {
//   id: "gk9",
//   name: "Restoring The Heart",
//   characteristics: ["action"],
//   text: "Remove up to 3 damage from chosen character or location. Draw a card.",
//   type: "action",
//   abilities: [restoringTheHeartAbility],
//   inkwell: true,
//   colors: ["amber", "sapphire"],
//   cost: 1,
//   illustrator: "Nicola Saviori / Livio Cacciatore",
//   number: 39,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618132,
//   },
//   rarity: "uncommon",
// };
//
