import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanNeverLandPrankster: CharacterCard = {
  id: "13z",
  cardType: "character",
  name: "Peter Pan",
  version: "Never Land Prankster",
  fullName: "Peter Pan - Never Land Prankster",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "006",
  text: "LOOK INNOCENT This character enters play exerted.\nCAN'T TAKE A JOKE? While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 1,
  cardNumber: 85,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "901bb3b670de6ab6f6671cfe9ec415bbd300f9c0",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import type { PlayerRestrictionStaticAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { opponent } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import { entersPlayExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// const ability: PlayerRestrictionStaticAbility = {
//   type: "static",
//   ability: "player-restriction",
//   effect: {
//     type: "player-restriction",
//     restriction: "gain-lore",
//     target: opponent,
//   },
// };
//
// export const peterPanNeverLandPrankster: LorcanitoCharacterCard = {
//   id: "cvd",
//   name: "Peter Pan",
//   title: "Never Land Prankster",
//   characteristics: ["storyborn", "hero"],
//   text: "LOOK INNOCENT This character enters play exerted.\nCAN'T TAKE A JOKE? While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.",
//   type: "character",
//   abilities: [
//     entersPlayExerted({
//       name: "Look Innocent",
//     }),
//     whileConditionThisCharacterGains({
//       name: "Can't Take A Joke?",
//       text: "While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.",
//       ability: ability,
//       conditions: [
//         { type: "exerted" },
//         {
//           type: "this-turn",
//           value: "has-challenged",
//           target: "opponent",
//           negate: true,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 7,
//   strength: 4,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Ellie Horie",
//   number: 85,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 583853,
//   },
//   rarity: "super_rare",
// };
//
