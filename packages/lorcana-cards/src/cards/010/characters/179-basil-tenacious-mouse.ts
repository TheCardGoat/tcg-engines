import type { CharacterCard } from "@tcg/lorcana-types";

export const basilTenaciousMouse: CharacterCard = {
  id: "l21",
  cardType: "character",
  name: "Basil",
  version: "Tenacious Mouse",
  fullName: "Basil - Tenacious Mouse",
  inkType: ["steel"],
  franchise: "Great Mouse Detective",
  set: "010",
  text: "HOLD YOUR GROUND Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 179,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4bf3f9bd5e3d7bcb4c090ce4252f79077301a240",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const basilTenaciousMouse: LorcanitoCharacterCard = {
//   id: "c6e",
//   name: "Basil",
//   title: "Tenacious Mouse",
//   characteristics: ["dreamborn", "hero", "detective"],
//   text: "HOLD YOUR GROUND Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Federico Maria Cugliari",
//   number: 179,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658783,
//   },
//   rarity: "common",
//   abilities: [
//     wheneverPlays({
//       name: "HOLD YOUR GROUND",
//       text: "Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn.",
//       triggerTarget: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "characteristics", value: ["detective"] },
//         ],
//       },
//       effects: [
//         {
//           type: "ability",
//           ability: "resist",
//           modifier: "add",
//           amount: 1,
//           duration: "next_turn",
//           until: true,
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
