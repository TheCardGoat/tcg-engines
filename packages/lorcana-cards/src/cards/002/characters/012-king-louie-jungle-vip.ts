import type { CharacterCard } from "@tcg/lorcana-types";

export const kingLouieJungleVip: CharacterCard = {
  id: "3ec",
  cardType: "character",
  name: "King Louie",
  version: "Jungle VIP",
  fullName: "King Louie - Jungle VIP",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "002",
  text: "LAY IT ON THE LINE Whenever another character is banished, you may remove up to 2 damage from this character.",
  cost: 7,
  strength: 3,
  willpower: 8,
  lore: 2,
  cardNumber: 12,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0c3fed9a867179785f504207a81666bcfe1b2abc",
  },
  abilities: [],
  classifications: ["Storyborn", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverAnotherCharIsBanished } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const kingLouieJungleVip: LorcanitoCharacterCard = {
//   id: "xiu",
//   name: "King Louie",
//   title: "Jungle VIP",
//   characteristics: ["storyborn", "king"],
//   text: "**LAY IT ON THE LINE** Whenever another character is banished, you may remove up to 2 damage from this character.",
//   type: "character",
//   abilities: [
//     wheneverAnotherCharIsBanished({
//       name: "Lay It On The Line",
//       text: "Whenever another character is banished, you may remove up to 2 damage from this character.",
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Cool it, boy. Unwind yourself.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 7,
//   strength: 3,
//   willpower: 8,
//   lore: 2,
//   illustrator: "Hadjie Joos",
//   number: 12,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527613,
//   },
//   rarity: "super_rare",
// };
//
