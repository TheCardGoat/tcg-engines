import type { CharacterCard } from "@tcg/lorcana-types";

export const captainAmeliaCommanderOfTheLegacy: CharacterCard = {
  id: "1ln",
  cardType: "character",
  name: "Captain Amelia",
  version: "Commander of the Legacy",
  fullName: "Captain Amelia - Commander of the Legacy",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "DRIVELING GALOOTS This character can't be challenged by Pirate characters.\nEVERYTHING SHIPSHAPE While being challenged, your other characters gain Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 192,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cfbdd1113e262b66941b16da85701f5a8aa882eb",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Alien", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/target";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const captainAmeliaCommanderOfTheLegacy: LorcanitoCharacterCard = {
//   id: "izk",
//   name: "Captain Amelia",
//   title: "Commander of the Legacy",
//   characteristics: ["storyborn", "ally", "alien", "captain"],
//   text: "DRIVELING GALOOTS This character can't be challenged by Pirate characters.\nEVERYTHING SHIPSHAPE While being challenged, your other characters gain Resist +1. (Damage dealt to them is reduced by 1.)",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "Driveling Galoots",
//       text: "This character can't be challenged by Pirate characters.",
//       effects: [
//         {
//           type: "restriction",
//           restriction: "be-challenged",
//           target: thisCharacter,
//           challengerFilters: [{ filter: "characteristics", value: ["pirate"] }],
//         },
//       ],
//     },
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Everything Shipshape",
//       text: "While being challenged, your other characters gain Resist +1.",
//       gainedAbility: resistAbility(1, true, true),
//       target: yourOtherCharacters,
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 1,
//   willpower: 4,
//   lore: 2,
//   illustrator: "French Carlomagno",
//   number: 192,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588073,
//   },
//   rarity: "super_rare",
// };
//
