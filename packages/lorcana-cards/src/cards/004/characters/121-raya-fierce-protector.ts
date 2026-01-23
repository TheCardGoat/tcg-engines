import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaFierceProtector: CharacterCard = {
  id: "arj",
  cardType: "character",
  name: "Raya",
  version: "Fierce Protector",
  fullName: "Raya - Fierce Protector",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  text: "DON'T CROSS ME Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 121,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "26cc86f21b2d1246e0ad32b654c821192af603c0",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const rayaFierceProtector: LorcanitoCharacterCard = {
//   id: "bcw",
//   name: "Raya",
//   title: "Fierce Protector",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**DON'T CROSS ME** Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.",
//   type: "character",
//   abilities: [
//     wheneverChallengesAnotherChar({
//       name: "**DON'T CROSS ME**",
//       text: "Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.",
//       effects: [
//         youGainLore({
//           dynamic: true,
//           filters: [
//             { filter: "zone", value: "play" },
//             { filter: "status", value: "damaged" },
//             { filter: "owner", value: "self" },
//             { filter: "source", value: "other" },
//           ],
//         }),
//       ],
//     }),
//   ],
//   flavour: "You're going to fight an entire army? \n−Sisu",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Peter Brockhammer",
//   number: 121,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550598,
//   },
//   rarity: "super_rare",
// };
//
