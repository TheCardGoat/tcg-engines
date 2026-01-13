import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiPersistentPresence: CharacterCard = {
  id: "1a9",
  cardType: "character",
  name: "HeiHei",
  version: "Persistent Presence",
  fullName: "HeiHei - Persistent Presence",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "002",
  text: "HE'S BACK! When this character is banished in a challenge, return this card to your hand.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 43,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a6b5ad0750d9770259ba18ba82b625783ad4c125",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const heiheiPersistentPresence: LorcanitoCharacterCard = {
//   id: "anm",
//
//   name: "HeiHei",
//   title: "Persistent Presence",
//   characteristics: ["dreamborn", "ally"],
//   text: "**HE'S BACK!** When this character is banished in a challenge, return this card to your hand.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanishedInAChallenge({
//       name: "He's Back",
//       text: "When this character is banished in a challenge, return this card to your hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Power. Beauty. HeiHei.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 2,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Ellie Horie",
//   number: 43,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527736,
//   },
//   rarity: "uncommon",
// };
//
