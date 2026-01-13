import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceSavvySailor: CharacterCard = {
  id: "1hn",
  cardType: "character",
  name: "Alice",
  version: "Savvy Sailor",
  fullName: "Alice - Savvy Sailor",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)\nAHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 161,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c1525cc95d60ab6fa0f38486bcaaf6379619ef67",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { anotherChosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const aliceSavvySailor: LorcanitoCharacterCard = {
//   id: "w6y",
//   name: "Alice",
//   title: "Savvy Sailor",
//   characteristics: ["dreamborn", "hero"],
//   text: "Ward (Opponents can't choose this character except to challenge.)\nAHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
//   type: "character",
//   abilities: [
//     wardAbility,
//     wheneverQuests({
//       name: "Ahoy!",
//       text: "Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: anotherChosenCharacterOfYours,
//         },
//         {
//           type: "ability",
//           ability: "ward",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: anotherChosenCharacterOfYours,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 1,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Dustin Panolino",
//   number: 161,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591979,
//   },
//   rarity: "super_rare",
// };
//
