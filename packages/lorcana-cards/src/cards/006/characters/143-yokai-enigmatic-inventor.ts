import type { CharacterCard } from "@tcg/lorcana-types";

export const yokaiEnigmaticInventor: CharacterCard = {
  id: "nt2",
  cardType: "character",
  name: "Yokai",
  version: "Enigmatic Inventor",
  fullName: "Yokai - Enigmatic Inventor",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 143,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "55cd9563ee89ea9d2f1a02ae1e76ddb0ba8d24fe",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenItemOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youPayXLessToPlayNextItemThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const yokaiEnigmaticInventor: LorcanitoCharacterCard = {
//   id: "tel",
//   name: "Yokai",
//   title: "Enigmatic Inventor",
//   characteristics: ["storyborn", "villain", "inventor"],
//   text: "TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Time To Upgrade",
//       text: "Whenever this character quests, you may return one of your items to your hand to pay 2 {S} less for the next item you play this turn.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenItemOfYours,
//         },
//         youPayXLessToPlayNextItemThisTurn(2),
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Juan Diego Leon",
//   number: 143,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 583210,
//   },
//   rarity: "uncommon",
// };
//
