import type { CharacterCard } from "@tcg/lorcana-types";

export const tiggerInTheCrowsNest: CharacterCard = {
  id: "1q4",
  cardType: "character",
  name: "Tigger",
  version: "In the Crow's Nest",
  fullName: "Tigger - In the Crow's Nest",
  inkType: ["ruby"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSWASH YOUR BUCKLES Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 126,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dfa8a8096bd718d380931f64e28ae3d4947a6313",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Tigger", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const tiggerInTheCrowsNest: LorcanitoCharacterCard = {
//   id: "vf2",
//   name: "Tigger",
//   title: "In the Crow's Nest",
//   characteristics: ["hero", "storyborn", "pirate", "tigger"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**SWASH YOUR BUCKLES** Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     wheneverPlays({
//       name: "SWASH YOUR BUCKLES",
//       text: "Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["action"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           modifier: "add",
//           amount: 1,
//           duration: "turn",
//           target: thisCharacter,
//         },
//         {
//           type: "attribute",
//           attribute: "lore",
//           modifier: "add",
//           amount: 1,
//           duration: "turn",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 0,
//   willpower: 4,
//   lore: 1,
//   illustrator: "John Loren",
//   number: 126,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578188,
//   },
//   rarity: "rare",
// };
//
