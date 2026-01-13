import type { CharacterCard } from "@tcg/lorcana-types";

export const davidXanatosCharismaticLeader: CharacterCard = {
  id: "1jd",
  cardType: "character",
  name: "David Xanatos",
  version: "Charismatic Leader",
  fullName: "David Xanatos - Charismatic Leader",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  text: "LEARN FROM EVERYTHING During your turn, whenever one of your characters is banished, draw a card.\nWHAT ARE YOU WAITING FOR? Whenever this character quests, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 116,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c792b4865fb6b929492c9c03e4c01fa833fe5d12",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import {
//   wheneverOneOfYouCharactersIsBanished,
//   wheneverQuests,
// } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const davidXanatosCharismaticLeader: LorcanitoCharacterCard = {
//   id: "fbk",
//   name: "David Xanatos",
//   title: "Charismatic Leader",
//   characteristics: ["storyborn", "villain"],
//   text: "LEARN FROM EVERYTHING During your turn, whenever one of your characters is banished, draw a card.\nWHAT ARE YOU WAITING FOR? Whenever this character quests, chosen character gains Rush this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Randy Bishop",
//   number: 116,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659622,
//   },
//   rarity: "super_rare",
//   lore: 2,
//   abilities: [
//     wheneverOneOfYouCharactersIsBanished({
//       name: "LEARN FROM EVERYTHING",
//       text: "During your turn, whenever one of your characters is banished, draw a card.",
//       conditions: [duringYourTurn],
//       effects: [drawXCards(1)],
//     }),
//     wheneverQuests({
//       name: "WHAT ARE YOU WAITING FOR?",
//       text: "Whenever this character quests, chosen character gains Rush this turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "rush",
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
// };
//
