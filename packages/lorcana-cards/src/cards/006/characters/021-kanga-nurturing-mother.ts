import type { CharacterCard } from "@tcg/lorcana-types";

export const kangaNurturingMother: CharacterCard = {
  id: "qu5",
  cardType: "character",
  name: "Kanga",
  version: "Nurturing Mother",
  fullName: "Kanga - Nurturing Mother",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "SAFE AND SOUND Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 21,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "60b997fd5e49d37c9accc8253365dcc6f385e43a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const kangaNurturingMother: LorcanitoCharacterCard = {
//   id: "blu",
//   missingTestCase: true,
//   name: "Kanga",
//   title: "Nurturing Mother",
//   characteristics: ["storyborn", "ally"],
//   text: "SAFE AND SOUND Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Safe and Sound",
//       text: "Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.",
//       effects: [
//         {
//           type: "restriction",
//           restriction: "be-challenged",
//           target: chosenCharacterOfYours,
//           duration: "next_turn",
//           until: true,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Gianluca Barone",
//   number: 21,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593019,
//   },
//   rarity: "rare",
// };
//
