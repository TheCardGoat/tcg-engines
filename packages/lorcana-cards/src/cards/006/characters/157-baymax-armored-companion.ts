import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxArmoredCompanion: CharacterCard = {
  id: "12n",
  cardType: "character",
  name: "Baymax",
  version: "Armored Companion",
  fullName: "Baymax - Armored Companion",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "THE TREATMENT IS WORKING When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 157,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8b5b13c2943342369d72422e5cc509b8583ffe42",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Robot"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const baymaxArmoredCompanion: LorcanitoCharacterCard = {
//   id: "hmt",
//   name: "Baymax",
//   title: "Armored Companion",
//   characteristics: ["hero", "storyborn", "robot"],
//   text: "**THE TREATMENT IS WORKING** When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
//   type: "character",
//   abilities: whenPlayAndWheneverQuests({
//     name: "The Treatment is Working",
//     text: "When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
//     optional: true,
//     effects: [
//       {
//         type: "heal",
//         amount: 2,
//         upTo: true,
//         subEffect: youGainLore(1), //FIXME: Should be equal to healed damage
//         target: {
//           type: "card",
//           value: 1,
//           excludeSelf: true,
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//           ],
//         },
//       },
//     ],
//   }),
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 2,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Brianna Garcia",
//   number: 157,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578165,
//   },
//   rarity: "legendary",
// };
//
