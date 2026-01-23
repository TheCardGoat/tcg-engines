import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseStoryteller: CharacterCard = {
  id: "i03",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Storyteller",
  fullName: "Minnie Mouse - Storyteller",
  inkType: ["amber"],
  set: "007",
  text: "GATHER AROUND Whenever you play a character, this character gets +1 {L} this turn.\nJUST ONE MORE Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 0,
  cardNumber: 31,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "40e23a6aa4e9b85c3ae4a6b8a3433cc2c36a426c",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   wheneverQuests,
//   wheneverYouPlayACharacter,
// } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { thisCharacterGetsLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const minnieMouseStoryteller: LorcanitoCharacterCard = {
//   id: "m22",
//   name: "Minnie Mouse",
//   title: "Storyteller",
//   characteristics: ["storyborn", "hero"],
//   text: "GATHER AROUND Whenever you play a character, this character gets +1 {L} this turn.\nJUST ONE MORE Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayACharacter({
//       name: "GATHER AROUND",
//       text: "Whenever you play a character, this character gets +1 {L} this turn.",
//       effects: [thisCharacterGetsLore(1)],
//     }),
//     wheneverQuests({
//       name: "JUST ONE MORE",
//       text: "Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: { dynamic: true, sourceAttribute: "lore" },
//           modifier: "subtract",
//           duration: "next_turn",
//           resolveAmountBeforeCreatingLayer: true,
//           until: true,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   illustrator: "SCG",
//   number: 31,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619424,
//   },
//   rarity: "legendary",
//   lore: 0,
// };
//
