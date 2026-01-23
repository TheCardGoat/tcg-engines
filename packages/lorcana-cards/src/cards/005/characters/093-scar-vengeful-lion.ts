import type { CharacterCard } from "@tcg/lorcana-types";

export const scarVengefulLion: CharacterCard = {
  id: "15b",
  cardType: "character",
  name: "Scar",
  version: "Vengeful Lion",
  fullName: "Scar - Vengeful Lion",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "Ward (Opponents can't choose this character except to challenge.)\nLIFE'S NOT FAIR, IS IT? Whenever one of your characters challenges a damaged character, you may draw a card.",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  cardNumber: 93,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "94e713f1c1f184e73a082487f65cd724657ffbec",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverOneOfYourCharChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const scarVengefulLion: LorcanitoCharacterCard = {
//   id: "rkn",
//   missingTestCase: true,
//   name: "Scar",
//   title: "Vengeful Lion",
//   characteristics: ["storyborn", "villain"],
//   text: "**Ward**'\n\n**LIFE'S NOT FAIR, IS IT?** Whenever one of your characters challenges a damaged character, you may draw a card.",
//   type: "character",
//   abilities: [
//     wardAbility,
//     wheneverOneOfYourCharChallengesAnotherChar({
//       name: "**LIFE'S NOT FAIR, IS IT?**",
//       text: "Whenever one of your characters challenges a damaged character, you may draw a card.",
//       optional: true,
//       effects: [drawACard],
//       defenderFilter: [
//         {
//           filter: "status",
//           value: "damage",
//           comparison: { operator: "gt", value: 0 },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 4,
//   willpower: 2,
//   lore: 1,
//   illustrator: "César Vergara",
//   number: 93,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555248,
//   },
//   rarity: "rare",
// };
//
