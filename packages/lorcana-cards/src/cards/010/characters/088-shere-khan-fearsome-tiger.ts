import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanFearsomeTiger: CharacterCard = {
  id: "1gj",
  cardType: "character",
  name: "Shere Khan",
  version: "Fearsome Tiger",
  fullName: "Shere Khan - Fearsome Tiger",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 88,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bd5700db4398aef9046429719282594d5034b5a8",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   anotherChosenCharacter,
//   chosenOpposingDamagedCharacter,
// } from "@lorcanito/lorcana-engine/abilities/target";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import {
//   mayBanish,
//   putDamageEffect,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const shereKhanFearsomeTiger: LorcanitoCharacterCard = {
//   id: "j1t",
//   name: "Shere Khan",
//   title: "Fearsome Tiger",
//   characteristics: ["storyborn", "villain"],
//   text: "Evasive\n\nON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.",
//   type: "character",
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 5,
//   willpower: 4,
//   illustrator: "Luis Huerta",
//   number: 88,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659623,
//   },
//   rarity: "legendary",
//   lore: 2,
//   abilities: [
//     evasiveAbility,
//     wheneverQuests({
//       name: "ON THE HUNT",
//       text: "Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.",
//       effects: [
//         {
//           ...mayBanish(chosenOpposingDamagedCharacter, true),
//           afterEffect: [
//             {
//               type: "create-layer-for-player",
//               target: self,
//               layer: {
//                 type: "resolution",
//                 responder: "self",
//                 name: "ON THE HUNT",
//                 text: "You may put 1 damage counter on another chosen character.",
//                 optional: true,
//                 effects: [putDamageEffect(1, anotherChosenCharacter)],
//               },
//             },
//           ],
//         },
//       ],
//     }),
//   ],
// };
//
