import type { CharacterCard } from "@tcg/lorcana-types";

export const arthurWizardsApprentice: CharacterCard = {
  id: "gq1",
  cardType: "character",
  name: "Arthur",
  version: "Wizard's Apprentice",
  fullName: "Arthur - Wizard's Apprentice",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "STUDENT Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 35,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3c45ec5faee5f49118a102e59e99043cc430699b",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { anotherChosenCharOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const arthurWizardsApprentice: LorcanitoCharacterCard = {
//   id: "rvh",
//   name: "Arthur",
//   title: "Wizard's Apprentice",
//   characteristics: ["hero", "dreamborn", "sorcerer"],
//   text: "**STUDENT** Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Student",
//       text: "Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.",
//       dependentEffects: true,
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: anotherChosenCharOfYours,
//         },
//         {
//           type: "lore",
//           modifier: "add",
//           amount: 2,
//           target: self,
//         },
//       ],
//     }),
//   ],
//   flavour: "Hmm . . what spell should I try next?",
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Jake Parker",
//   number: 35,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 522738,
//   },
//   rarity: "super_rare",
// };
//
