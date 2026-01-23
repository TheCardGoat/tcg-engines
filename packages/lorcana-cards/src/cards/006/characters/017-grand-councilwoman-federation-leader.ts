import type { CharacterCard } from "@tcg/lorcana-types";

export const grandCouncilwomanFederationLeader: CharacterCard = {
  id: "zvy",
  cardType: "character",
  name: "Grand Councilwoman",
  version: "Federation Leader",
  fullName: "Grand Councilwoman - Federation Leader",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "FIND IT! Whenever this character quests, your other Alien characters get +1 {L} this turn.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 17,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "815730fcdc4c6accaa8fb641f7e2461e62a2513a",
  },
  abilities: [],
  classifications: ["Storyborn", "Alien"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const grandCouncilwomanFederationLeader: LorcanitoCharacterCard = {
//   id: "gs9",
//   missingTestCase: true,
//   name: "Grand Councilwoman",
//   title: "Federation Leader",
//   characteristics: ["storyborn", "alien"],
//   text: "FIND IT! Whenever this character quests, your other Alien characters get +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Find It!",
//       text: "Whenever this character quests, your other Alien characters get +1 {L} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             excludeSelf: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["alien"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Aisha Durrgambetova",
//   number: 17,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587757,
//   },
//   rarity: "common",
// };
//
