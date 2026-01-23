import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckBuccaneer: CharacterCard = {
  id: "va5",
  cardType: "character",
  name: "Donald Duck",
  version: "Buccaneer",
  fullName: "Donald Duck - Buccaneer",
  inkType: ["steel"],
  set: "004",
  text: "BOARDING PARTY During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 179,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "70bdce65e25cf1ef00c6df3f40197bc6ed86aacc",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const donaldDuckBuccaneer: LorcanitoCharacterCard = {
//   id: "vz0",
//   name: "Donald Duck",
//   title: "Buccaneer",
//   characteristics: ["hero", "dreamborn", "pirate", "captain"],
//   text: "**BOARDING PARTY** During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     wheneverBanishesAnotherCharacterInChallenge({
//       name: "BOARDING PARTY",
//       text: "During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
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
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Nobody stands a chance against the daring duck of the high seas!",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Federico M. Cugliari",
//   number: 179,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549457,
//   },
//   rarity: "legendary",
// };
//
