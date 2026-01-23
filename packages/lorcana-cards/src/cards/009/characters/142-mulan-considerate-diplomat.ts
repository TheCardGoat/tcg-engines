import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanConsiderateDiplomat: CharacterCard = {
  id: "1t2",
  cardType: "character",
  name: "Mulan",
  version: "Considerate Diplomat",
  fullName: "Mulan - Considerate Diplomat",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "009",
  text: "IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 142,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ea88882b3f4acc19ba2c6ab0bbd81759c55e6677",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const mulanConsiderateDiplomat: LorcanitoCharacterCard = {
//   id: "k64",
//   missingTestCase: false,
//   name: "Mulan",
//   title: "Considerate Diplomat",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   illustrator: "LadyShalirin",
//   number: 142,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650077,
//   },
//   rarity: "super_rare",
//   abilities: [
//     wheneverThisCharacterQuests({
//       name: "IMPERIAL INVITATION",
//       text: "Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//       effects: [
//         {
//           type: "scry",
//           amount: 4,
//           mode: "bottom",
//           shouldRevealTutored: true,
//           target: self,
//           limits: {
//             bottom: 4,
//             top: 0,
//             inkwell: 0,
//             hand: 1,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//             { filter: "type", value: "character" },
//             { filter: "characteristics", value: ["princess"] },
//           ],
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
