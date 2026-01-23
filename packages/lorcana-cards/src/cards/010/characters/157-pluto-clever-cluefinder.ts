import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoCleverCluefinder: CharacterCard = {
  id: "cpr",
  cardType: "character",
  name: "Pluto",
  version: "Clever Cluefinder",
  fullName: "Pluto - Clever Cluefinder",
  inkType: ["sapphire"],
  set: "010",
  text: "ON THE TRAIL {E} — If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 157,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2dd40e3fd534499bc09a776ca3a81b70d12387ea",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// const itemFromDiscard = {
//   type: "card",
//   value: 1,
//   filters: [
//     {
//       filter: "type",
//       value: "item",
//     },
//     {
//       filter: "zone",
//       value: "discard",
//     },
//     {
//       filter: "owner",
//       value: "self",
//     },
//   ],
// } as const;
//
// const hasDetectiveInPlay = {
//   type: "filter",
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "owner", value: "self" },
//     { filter: "type", value: "character" },
//     { filter: "characteristics", value: ["detective"] },
//   ],
//   comparison: { operator: "gte", value: 1 },
// } as const;
//
// const noDetectiveInPlay = {
//   type: "filter",
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "owner", value: "self" },
//     { filter: "type", value: "character" },
//     { filter: "characteristics", value: ["detective"] },
//   ],
//   comparison: { operator: "lt", value: 1 },
// } as const;
//
// const onTheTrailAbility = {
//   type: "activated",
//   name: "ON THE TRAIL",
//   text: "{E} - If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.",
//   costs: [{ type: "exert" }],
//   effects: [
//     {
//       type: "create-layer-based-on-condition",
//       target: {
//         type: "player",
//         value: "self",
//       },
//       conditionalEffects: [
//         {
//           conditions: [hasDetectiveInPlay],
//           effects: [
//             {
//               type: "move",
//               to: "hand",
//               target: itemFromDiscard,
//             },
//           ],
//         },
//         {
//           conditions: [noDetectiveInPlay],
//           effects: [
//             {
//               type: "move",
//               to: "deck",
//               target: itemFromDiscard,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// } as const;
//
// export const plutoCleverCluefinder = {
//   id: "hbv",
//   name: "Pluto",
//   title: "Clever Cluefinder",
//   characteristics: ["dreamborn", "ally"],
//   text: "ON THE TRAIL {E} - If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Liz Richards",
//   number: 157,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659385,
//   },
//   rarity: "uncommon",
//   abilities: [onTheTrailAbility],
//   lore: 1,
// } as const satisfies LorcanitoCharacterCard;
//
