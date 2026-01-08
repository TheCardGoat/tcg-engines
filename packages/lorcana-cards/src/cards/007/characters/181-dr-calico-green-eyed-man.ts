import type { CharacterCard } from "@tcg/lorcana-types";

export const drCalicoGreeneyedMan: CharacterCard = {
  id: "uk6",
  cardType: "character",
  name: "Dr. Calico",
  version: "Green-Eyed Man",
  fullName: "Dr. Calico - Green-Eyed Man",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "007",
  text: "YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6e241493e0ee6543ecca03f5f5e315161367b063",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const drCalicoGreeneyedMan: LorcanitoCharacterCard = {
//   id: "q5s",
//   name: "Dr. Calico",
//   title: "Green-Eyed Man",
//   characteristics: ["storyborn", "villain"],
//   text: "YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2.",
//   type: "character",
//   abilities: [
//     {
//       ...resistAbility(2),
//       conditions: [
//         { type: "damage", comparison: { operator: "eq", value: 0 } },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Wouter Bruneel",
//   number: 181,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618160,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
