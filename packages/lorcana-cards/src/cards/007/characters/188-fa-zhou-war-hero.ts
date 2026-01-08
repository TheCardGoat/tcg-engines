import type { CharacterCard } from "@tcg/lorcana-types";

export const faZhouWarHero: CharacterCard = {
  id: "1i5",
  cardType: "character",
  name: "Fa Zhou",
  version: "War Hero",
  fullName: "Fa Zhou - War Hero",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "007",
  text: "TRAINING EXERCISES Whenever one of your characters challenges another character, if it's the second challenge this turn, gain 3 lore.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 188,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0569382cc56b9650bdb6db49b16d08e519dba845",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverOneOfYourCharChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const faZhouWarHero: LorcanitoCharacterCard = {
//   id: "bu5",
//   name: "Fa Zhou",
//   title: "War Hero",
//   characteristics: ["storyborn", "hero"],
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Mel Milton",
//   number: 188,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619515,
//   },
//   rarity: "rare",
//   lore: 1,
//   text: "TRAINING EXERCISES Whenever one of your characters challenges another character, if it's the second challenge this turn, you gain 3 lore.",
//   abilities: [
//     wheneverOneOfYourCharChallengesAnotherChar({
//       name: "TRAINING EXERCISES",
//       text: "Whenever one of your characters challenges another character, if it's the second challenge this turn, you gain 3 lore.",
//       attackerFilter: [
//         {
//           filter: "turn",
//           value: "challenge",
//           // TODO: the problem here is that during this filter evaluation, we don't have information about who is the attacker or the defender
//           targetFilter: [{ filter: "owner", value: "self" }],
//           // TODO: Unfortunately, the check happens before we update the challenge counter, that's why we're counting 1 and not 2
//           comparison: { operator: "eq", value: 1 },
//         },
//       ],
//       effects: [youGainLore(3)],
//     }),
//   ],
// };
//
