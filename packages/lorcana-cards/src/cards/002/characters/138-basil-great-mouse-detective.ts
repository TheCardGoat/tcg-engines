import type { CharacterCard } from "@tcg/lorcana-types";

export const basilGreatMouseDetective: CharacterCard = {
  id: "1vg",
  cardType: "character",
  name: "Basil",
  version: "Great Mouse Detective",
  fullName: "Basil - Great Mouse Detective",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Basil.)\nTHERE'S ALWAYS A CHANCE If you used Shift to play this character, you may draw 2 cards when he enters play.",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 3,
  cardNumber: 138,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f3066e534c839456566a4571a3fe088026b39ce7",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const basilGreatMouseDetective: LorcanitoCharacterCard = {
//   id: "xau",
//
//   name: "Basil",
//   title: "Great Mouse Detective",
//   characteristics: ["hero", "floodborn", "detective"],
//   text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Basil.)_\n\n**THERE'S ALWAYS A CHANCE** If you used **Shift** to play this character, you may draw 2 cards when he enters play.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "basil"),
//     {
//       type: "resolution",
//       name: "There's Always a Chance",
//       text: "If you used **Shift** to play this character, you may draw 2 cards when he enters play.",
//       optional: true,
//       resolutionConditions: [{ type: "resolution", value: "shift" }],
//       effects: [
//         {
//           type: "draw",
//           amount: 2,
//           target: self,
//         },
//       ],
//     },
//   ],
//   flavour: "A solution always presents itself.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 3,
//   willpower: 4,
//   lore: 3,
//   illustrator: "Bill Robinson",
//   number: 138,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525232,
//   },
//   rarity: "super_rare",
// };
//
