import type { CharacterCard } from "@tcg/lorcana-types";

export const boltHeadstrongDog: CharacterCard = {
  id: "131",
  cardType: "character",
  name: "Bolt",
  version: "Headstrong Dog",
  fullName: "Bolt - Headstrong Dog",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "007",
  text: "THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 184,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e6b0a691fd08092d8dcbaaa348d77b450f4795e",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const boltHeadstrongDog: LorcanitoCharacterCard = {
//   id: "g7i",
//   name: "Bolt",
//   title: "Headstrong Dog",
//   characteristics: ["storyborn", "hero"],
//   text: "THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       ...youMayDrawThenChooseAndDiscard,
//       name: "THERE'S NO TURNING BACK",
//       text: "Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.",
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "source", value: "self" },
//             {
//               filter: "status",
//               value: "damage",
//               comparison: { operator: "eq", value: 0 },
//             },
//           ],
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   illustrator: "Brian Weisz",
//   number: 184,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618158,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
