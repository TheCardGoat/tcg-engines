import type { CharacterCard } from "@tcg/lorcana-types";

export const giantCobraGhostlySerpent: CharacterCard = {
  id: "1bh",
  cardType: "character",
  name: "Giant Cobra",
  version: "Ghostly Serpent",
  fullName: "Giant Cobra - Ghostly Serpent",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "007",
  text: "Vanish (When an opponent chooses this character for an action, banish them.)\nMYSTERIOUS ADVANTAGE When you play this character, you may choose and discard a card to gain 2 lore.",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 57,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ab23bc0d0f42e3fa41a43526d6fca8f364824467",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Illusion"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { vanishAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const giantCobraGhostlySerpent: LorcanitoCharacterCard = {
//   id: "u16",
//   name: "Giant Cobra",
//   title: "Ghostly Serpent",
//   characteristics: ["dreamborn", "ally", "illusion"],
//   text: "Vanish\nMYSTERIOUS ADVANTAGE When you play this character, you may choose and discard a card to gain 2 lore.",
//   type: "character",
//   abilities: [
//     vanishAbility,
//     whenYouPlayThis({
//       name: "MYSTERIOUS ADVANTAGE",
//       text: "When you play this character, you may choose and discard a card to gain 2 lore.",
//       optional: true,
//       effects: [
//         {
//           type: "discard",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//             ],
//           },
//           forEach: [youGainLore(2)],
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//
//   colors: ["amethyst", "steel"],
//   cost: 3,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Nicola Saviori",
//   number: 57,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618174,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
