import type { LocationCard } from "@tcg/lorcana-types";

export const illuminaryTunnelsLinkedCaverns: LocationCard = {
  id: "1ij",
  cardType: "location",
  name: "Illuminary Tunnels",
  version: "Linked Caverns",
  fullName: "Illuminary Tunnels - Linked Caverns",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "010",
  text: "SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play.\nLOCUS While you have a character here, you pay 1 {I} less to play locations.",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 202,
  inkable: true,
  externalIds: {
    ravensburger: "c5a75c70a7b0fda205c02f87ffa3da1a39760352",
  },
  abilities: [
    {
      id: "1ij-1",
      text: "SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play.",
      name: "SUBTERRANEAN NETWORK",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "locations-in-play",
          controller: "you",
        },
        target: "SELF",
      },
      condition: {
        type: "has-character-here",
      },
    },
    {
      id: "1ij-2",
      text: "LOCUS While you have a character here, you pay 1 {I} less to play locations.",
      name: "LOCUS",
      type: "static",
      effect: {
        type: "cost-reduction",
        amount: 0,
        cardType: "location",
      },
      condition: {
        type: "has-character-here",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   DynamicAmount,
//   LorcanitoLocationCard,
// } from "@lorcanito/lorcana-engine";
// import type { StaticAbilityWithEffect } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { ifYouHaveACharacterHere } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { propertyStaticAbilities } from "@lorcanito/lorcana-engine/abilities/propertyStaticAbilities";
// import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// const forEachOtherLocationYouHaveInPlay: DynamicAmount = {
//   dynamic: true,
//   excludeSelf: true,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "location" },
//     { filter: "owner", value: "self" },
//   ],
// };
//
// const pay1LessToPlayLocations: StaticAbilityWithEffect = {
//   type: "static",
//   ability: "effects",
//   effects: [
//     {
//       type: "attribute",
//       attribute: "cost",
//       amount: 1,
//       modifier: "subtract",
//       duration: "static",
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "location" },
//           { filter: "zone", value: "hand" },
//         ],
//       },
//     },
//   ],
// };
// export const illuminaryTunnelsLinkedCaverns: LorcanitoLocationCard = {
//   id: "kmv",
//   name: "Illuminary Tunnels",
//   title: "Linked Caverns",
//   characteristics: ["location"],
//   text: "SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play. LOCUS While you have a character here, you pay 1 {I} less to play locations.",
//   type: "location",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   willpower: 6,
//   illustrator: "Dave Mitcheson / Paul Hogg",
//   number: 202,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658460,
//   },
//   rarity: "super_rare",
//   moveCost: 1,
//   lore: 1,
//   abilities: [
//     propertyStaticAbilities({
//       name: "SUBTERRANEAN NETWORK",
//       text: "this location gets +1 {L} for each other location you have in play.",
//       conditions: [ifYouHaveACharacterHere],
//       attribute: "lore",
//       amount: forEachOtherLocationYouHaveInPlay,
//     }),
//     whileConditionThisCharacterGains({
//       name: "LOCUS",
//       text: "While you have a character here, you pay 1 {I} less to play locations.",
//       conditions: [ifYouHaveACharacterHere],
//       ability: pay1LessToPlayLocations,
//     }),
//   ],
// };
//
