import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoSteelChampion: CharacterCard = {
  id: "1g1",
  cardType: "character",
  name: "Pluto",
  version: "Steel Champion",
  fullName: "Pluto - Steel Champion",
  inkType: ["steel"],
  set: "010",
  text: "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.\nMAKE ROOM Whenever you play another Steel character, you may banish chosen item.",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 191,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "054d01b8c7262fc35deae953e21e415e967fe99b",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   wheneverOpposingCharIsBanishedInChallenge,
//   wheneverPlays,
// } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import {
//   banishChosenItem,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const plutoSteelChampion: LorcanitoCharacterCard = {
//   id: "yw7",
//   name: "Pluto",
//   title: "Steel Champion",
//   characteristics: ["dreamborn", "ally"],
//   text: "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore. MAKE ROOM Whenever you play another Steel character, you may banish chosen item.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Lisa Parfenova",
//   number: 191,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659631,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [
//     wheneverOpposingCharIsBanishedInChallenge({
//       name: "WINNER TAKE ALL",
//       text: "During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.",
//       excludeSelf: true,
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       attackerFilters: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "color", value: ["steel"] },
//         { filter: "zone", value: "play" },
//       ],
//       effects: [youGainLore(2)],
//     }),
//     wheneverPlays({
//       name: "MAKE ROOM",
//       text: "Whenever you play another Steel character, you may banish chosen item.",
//       optional: true,
//       excludeSelf: true,
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           { filter: "color", value: ["steel"] },
//         ],
//       },
//       effects: [banishChosenItem],
//     }),
//   ],
// };
//
