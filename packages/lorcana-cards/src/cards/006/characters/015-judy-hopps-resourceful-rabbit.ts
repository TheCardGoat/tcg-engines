import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsResourcefulRabbit: CharacterCard = {
  id: "1r5",
  cardType: "character",
  name: "Judy Hopps",
  version: "Resourceful Rabbit",
  fullName: "Judy Hopps - Resourceful Rabbit",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "006",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nNEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 15,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "064fed608ce47eeb3e4ae4b15e6fc7f3e58763e1",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { readyAnotherChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const judyHoppsResourcefulRabbit: LorcanitoCharacterCard = {
//   id: "cd4",
//   name: "Judy Hopps",
//   title: "Resourceful Rabbit",
//   characteristics: ["storyborn", "hero"],
//   text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nNEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.",
//   type: "character",
//   abilities: [
//     supportAbility,
//     atTheEndOfYourTurn({
//       name: "Need Some Help?",
//       text: "At the end of your turn, you may ready another chosen character of yours.",
//       optional: true,
//       effects: [readyAnotherChosenCharacter],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 6,
//   strength: 3,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Lauren Barger",
//   number: 15,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 579923,
//   },
//   rarity: "rare",
// };
//
