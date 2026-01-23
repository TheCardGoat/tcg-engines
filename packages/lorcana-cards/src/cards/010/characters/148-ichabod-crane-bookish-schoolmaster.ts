import type { CharacterCard } from "@tcg/lorcana-types";

export const ichabodCraneBookishSchoolmaster: CharacterCard = {
  id: "hnb",
  cardType: "character",
  name: "Ichabod Crane",
  version: "Bookish Schoolmaster",
  fullName: "Ichabod Crane - Bookish Schoolmaster",
  inkType: ["sapphire"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "WELL-READ Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 148,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3f9a4fc0f61c93fc34e9d4be9a1e536b74cccb47",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ichabodCraneBookishSchoolmaster: LorcanitoCharacterCard = {
//   id: "jau",
//   name: "Ichabod Crane",
//   title: "Bookish Schoolmaster",
//   characteristics: ["storyborn", "hero"],
//   text: "WELL-READ Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Ismael González-Granero / Casey Jo Ocean",
//   number: 148,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660019,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [
//     wheneverQuests({
//       name: "WELL-READ",
//       text: "Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.",
//       effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//       conditions: [
//         {
//           type: "played-card",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//             {
//               filter: "attribute",
//               value: "strength",
//               comparison: { operator: "gte", value: 5 },
//             },
//           ],
//         },
//       ],
//     }),
//   ],
// };
//
