import type { CharacterCard } from "@tcg/lorcana-types";

export const kenaiBigBrother: CharacterCard = {
  id: "a82",
  cardType: "character",
  name: "Kenai",
  version: "Big Brother",
  fullName: "Kenai - Big Brother",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "005",
  text: "BROTHERS FOREVER While this character is exerted, your characters named Koda can't be challenged.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 5,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "24d95c1e01ef2ed85eb6d9a0623f71835ef9e722",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileThisCharacterIsExerted } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { yourCharactersNamed } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionOnThisCharacterTargetsGain } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// const name = "Brothers Forever";
// const text =
//   "While this character is exerted, your characters named Koda can't be challenged.";
//
// export const kenaiBigBrother: LorcanitoCharacterCard = {
//   id: "v56",
//   missingTestCase: true,
//   name: "Kenai",
//   title: "Big Brother",
//   characteristics: ["hero", "storyborn"],
//   text: "**BROTHERS FOREVER** While this character is exerted, your characters named Koda can't be challenged.",
//   type: "character",
//   abilities: [
//     whileConditionOnThisCharacterTargetsGain({
//       name,
//       text,
//       conditions: [whileThisCharacterIsExerted],
//       target: yourCharactersNamed("Koda"),
//       ability: {
//         type: "static",
//         ability: "effects",
//         name,
//         text,
//         effects: [
//           {
//             type: "restriction",
//             restriction: "be-challenged",
//             target: yourCharactersNamed("Koda"),
//             duration: "next_turn",
//             until: true,
//           },
//         ],
//       },
//     }),
//   ],
//   flavour:
//     "You have to look after your little brother, no matter how big a pain he is.\n—Kenai",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Chunxi Mu",
//   number: 5,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560502,
//   },
//   rarity: "common",
// };
//
