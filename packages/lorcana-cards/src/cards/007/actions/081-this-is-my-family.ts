import type { ActionCard } from "@tcg/lorcana-types";

export const thisIsMyFamily: ActionCard = {
  id: "1io",
  cardType: "action",
  name: "This Is My Family",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "007",
  text: "Gain 1 lore. Draw a card.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 81,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c3565f192febee8aaadc4da67348a3246ad959eb",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { thisIsMyFamilyAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const thisIsMyFamily: LorcanitoActionCard = {
//   id: "nk5",
//   name: "This Is My Family",
//   characteristics: ["action", "song"],
//   text: "Gain 1 lore. Draw a card.",
//   type: "action",
//   abilities: [thisIsMyFamilyAbility],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Cristian Romero",
//   number: 81,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619448,
//   },
//   rarity: "common",
// };
//
