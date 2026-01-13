import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineRebelliousPrincess: CharacterCard = {
  id: "zj2",
  cardType: "character",
  name: "Jasmine",
  version: "Rebellious Princess",
  fullName: "Jasmine - Rebellious Princess",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  text: "YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 106,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "800d5007d5b5ff2c47833042fe234c370d0741d4",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { eachOpponentLosesLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const jasmineRebelliousPrincess: LorcanitoCharacterCard = {
//   id: "rf3",
//   missingTestCase: true,
//   name: "Jasmine",
//   title: "Rebellious Princess",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "You'll Never Miss It",
//       text: "Whenever this character quests, each opponent loses 1 lore.",
//       effects: [eachOpponentLosesLore(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Malia Ewart",
//   number: 106,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588101,
//   },
//   rarity: "uncommon",
// };
//
