import type { CharacterCard } from "@tcg/lorcana-types";

export const bagheeraGuardianJaguar: CharacterCard = {
  id: "132",
  cardType: "character",
  name: "Bagheera",
  version: "Guardian Jaguar",
  fullName: "Bagheera - Guardian Jaguar",
  inkType: ["steel"],
  franchise: "Jungle Book",
  set: "007",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nYOU MUST BE BRAVE When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 198,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e707e6dd19e262dc08b7529a727f0a41a77b507",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const bagheeraGuardianJaguar: LorcanitoCharacterCard = {
//   id: "dnh",
//   name: "Bagheera",
//   title: "Guardian Jaguar",
//   characteristics: ["storyborn", "ally"],
//   text: "Bodyguard \nYOU MUST BE BRAVE When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
//   type: "character",
//   abilities: [
//     bodyguardAbility,
//     whenThisCharacterBanished({
//       conditions: [{ type: "during-turn", value: "opponent" }],
//       name: "You must be brave",
//       text: "When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
//       effects: [
//         dealDamageEffect(2, {
//           type: "card",
//           value: "all",
//           filters: [
//             {
//               filter: "owner",
//               value: "opponent",
//             },
//             { filter: "zone", value: "play" },
//             { filter: "type", value: "character" },
//           ],
//         }),
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Alice Pisoni",
//   number: 198,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619522,
//   },
//   rarity: "legendary",
//   lore: 2,
// };
//
