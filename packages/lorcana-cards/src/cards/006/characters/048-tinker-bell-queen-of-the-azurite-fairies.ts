import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellQueenOfTheAzuriteFairies: CharacterCard = {
  id: "18r",
  cardType: "character",
  name: "Tinker Bell",
  version: "Queen of the Azurite Fairies",
  fullName: "Tinker Bell - Queen of the Azurite Fairies",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Tinker Bell.)\nEvasive (Only characters with Evasive can challenge this character.)\nSHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 48,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a14b9855899fc7d42931d6539a133ec95160f245",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally", "Queen", "Fairy", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const tinkerBellQueenOfTheAzuriteFairies: LorcanitoCharacterCard = {
//   id: "rdx",
//   missingTestCase: true,
//   name: "Tinker Bell",
//   title: "Queen of the Azurite Fairies",
//   characteristics: ["floodborn", "ally", "queen", "fairy", "captain"],
//   text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Tinker Bell.)\nEvasive (Only characters with Evasive can challenge this character.)\nSHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "Tinker Bell"),
//     evasiveAbility,
//     wheneverQuests({
//       name: "Shining Example",
//       text: "Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
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
//               { filter: "characteristics", value: ["fairy"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 7,
//   strength: 5,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Livia Lopez",
//   number: 48,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 584614,
//   },
//   rarity: "uncommon",
// };
//
