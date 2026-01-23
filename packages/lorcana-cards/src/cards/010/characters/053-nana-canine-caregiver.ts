import type { CharacterCard } from "@tcg/lorcana-types";

export const nanaCanineCaregiver: CharacterCard = {
  id: "1lc",
  cardType: "character",
  name: "Nana",
  version: "Canine Caregiver",
  fullName: "Nana - Canine Caregiver",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "010",
  text: "HELPFUL INSTINCTS When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 53,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ceb423f003d728f152e41e23d2b982872ccc8463",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import {
//   discardACard,
//   returnChosenCharacterWithCostLess,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const nanaCanineCaregiver: LorcanitoCharacterCard = {
//   id: "db1",
//   name: "Nana",
//   title: "Canine Caregiver",
//   characteristics: ["storyborn", "ally"],
//   text: "HELPFUL INSTINCTS When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Rosa la Barbera / Livio Cacciatore",
//   number: 53,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660025,
//   },
//   rarity: "uncommon",
//   lore: 1,
//   abilities: [
//     whenYouPlayThis({
//       name: "HELPFUL INSTINCTS",
//       text: "When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.",
//       optional: true,
//       resolveEffectsIndividually: true,
//       dependentEffects: true,
//       effects: [discardACard, returnChosenCharacterWithCostLess(2)],
//     }),
//   ],
// };
//
