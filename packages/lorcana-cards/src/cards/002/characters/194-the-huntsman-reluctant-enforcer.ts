import type { CharacterCard } from "@tcg/lorcana-types";

export const theHuntsmanReluctantEnforcer: CharacterCard = {
  id: "voc",
  cardType: "character",
  name: "The Huntsman",
  version: "Reluctant Enforcer",
  fullName: "The Huntsman - Reluctant Enforcer",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "002",
  text: "CHANGE OF HEART Whenever this character quests, you may draw a card, then choose and discard a card.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 194,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7229d645f0b5c2c133c5e259e9c46cbb6c82fc78",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theHuntsmanReluctantEnforcer: LorcanitoCharacterCard = {
//   id: "f1a",
//
//   name: "The Huntsman",
//   title: "Reluctant Enforcer",
//   characteristics: ["storyborn", "ally"],
//   text: "**CHANGE OF HEART** Whenever this character quests, you may draw a card, then choose and discard a card.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       ...youMayDrawThenChooseAndDiscard,
//       name: "Change of Heart",
//       text: "Whenever this character quests, you may draw a card, then choose and discard a card.",
//     }),
//   ],
//   flavour: "Run away, hide! In the woods, anywhere!",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   lore: 2,
//   illustrator: "Gaku Kumatori",
//   number: 194,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527293,
//   },
//   rarity: "common",
// };
//
