import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoGuardDog: CharacterCard = {
  id: "173",
  cardType: "character",
  name: "Pluto",
  version: "Guard Dog",
  fullName: "Pluto - Guard Dog",
  inkType: ["steel"],
  set: "006",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBRAVO While this character has no damage, he gets +4 {S}.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 186,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9c5bb650890624e6318d5c6b2158c61235bdcf01",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const plutoGuardDog: LorcanitoCharacterCard = {
//   id: "mgd",
//   missingTestCase: true,
//   name: "Pluto",
//   title: "Guard Dog",
//   characteristics: ["storyborn", "ally"],
//   text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBRAVO While this character has no damage, he gets +4 {S}.",
//   type: "character",
//   abilities: [
//     bodyguardAbility,
//     {
//       type: "static",
//       ability: "effects",
//       name: "Bravo",
//       text: "While this character has no damage, he gets +4 {S}.",
//       conditions: [
//         { type: "damage", comparison: { operator: "eq", value: 0 } },
//       ],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 4,
//           modifier: "add",
//           duration: "turn",
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 1,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Hedvig Häggman-Sund",
//   number: 186,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593037,
//   },
//   rarity: "uncommon",
// };
//
