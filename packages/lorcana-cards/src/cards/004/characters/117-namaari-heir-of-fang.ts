import type { CharacterCard } from "@tcg/lorcana-types";

export const namaariHeirOfFang: CharacterCard = {
  id: "ms7",
  cardType: "character",
  name: "Namaari",
  version: "Heir of Fang",
  fullName: "Namaari - Heir of Fang",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  text: "TWO-WEAPON FIGHTING During your turn, whenever this character deals damage to another character in a challenge, you may deal the same amount of damage to another chosen character.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 117,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "521ce4f66df51b285ab86117acb31ce464771ddb",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverThisCharacterDealsDamageInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const namaariHeirOfFang: LorcanitoCharacterCard = {
//   id: "mnr",
//   name: "Namaari",
//   title: "Heir of Fang",
//   characteristics: ["storyborn", "villain", "princess"],
//   text: "**TWO-WEAPON FIGHTING** During your turn, whenever this character deals damage to another character in a challenge, you may deal the same amount of damage to another chosen character.",
//   type: "character",
//   abilities: [
//     wheneverThisCharacterDealsDamageInChallenge({
//       name: "Two-Weapon Fighting",
//       text: "During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to another chosen character.",
//       conditions: [{ type: "during-turn", value: "self" }],
//       optional: true,
//       effects: [
//         {
//           type: "damage",
//           amount: {
//             dynamic: true,
//             getAmountFromTrigger: true,
//           },
//           target: {
//             type: "card",
//             value: 1,
//             excludeSelf: true,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "source", value: "other" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Kasia Brezinska",
//   number: 117,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549460,
//   },
//   rarity: "rare",
// };
//
