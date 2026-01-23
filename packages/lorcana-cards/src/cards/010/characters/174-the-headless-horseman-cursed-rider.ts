import type { CharacterCard } from "@tcg/lorcana-types";

export const theHeadlessHorsemanCursedRider: CharacterCard = {
  id: "1xu",
  cardType: "character",
  name: "The Headless Horseman",
  version: "Cursed Rider",
  fullName: "The Headless Horseman - Cursed Rider",
  inkType: ["steel"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named The Headless Horseman.)\nWITCHING HOUR When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.",
  cost: 8,
  strength: 5,
  willpower: 7,
  lore: 2,
  cardNumber: 174,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fbb6977c78837de7431436c9a91dcd55431e7847",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { allPlayers } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { DrawDiscardCountActionsEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const witchingHourEffect: DrawDiscardCountActionsEffect = {
//   type: "draw-discard-count-actions",
//   target: allPlayers,
//   drawAmount: 3,
//   discardAmount: 3,
//   damagePerAction: 2,
//   damageTarget: {
//     type: "card",
//     value: 1,
//     filters: [
//       { filter: "zone", value: "play" },
//       { filter: "owner", value: "opponent" },
//       { filter: "type", value: "character" },
//     ],
//   },
// };
//
// export const theHeadlessHorsemanCursedRider: LorcanitoCharacterCard = {
//   id: "od7",
//   name: "The Headless Horseman",
//   title: "Cursed Rider",
//   characteristics: ["floodborn", "villain"],
//   text: "Shift 5\n\nWITCHING HOUR When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 8,
//   strength: 5,
//   willpower: 7,
//   illustrator: "Marcel Berg",
//   number: 174,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660020,
//   },
//   rarity: "super_rare",
//   lore: 2,
//   abilities: [
//     shiftAbility(5, "The Headless Horseman"),
//     whenYouPlayThisCharacter({
//       name: "WITCHING HOUR",
//       text: "When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.",
//       effects: [witchingHourEffect],
//     }),
//   ],
// };
//
