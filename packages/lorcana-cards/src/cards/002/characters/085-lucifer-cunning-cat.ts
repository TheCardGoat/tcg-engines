import type { CharacterCard } from "@tcg/lorcana-types";

export const luciferCunningCat: CharacterCard = {
  id: "1ua",
  cardType: "character",
  name: "Lucifer",
  version: "Cunning Cat",
  fullName: "Lucifer - Cunning Cat",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "002",
  text: "MOUSE CATCHER When you play this character, each opponent chooses and discards either 2 cards or 1 action card.",
  cost: 5,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 85,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ee4d4809396b53e10d975f147e56450ed93eaaff",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const luciferCunningCat: LorcanitoCharacterCard = {
//   id: "s0r",
//   name: "Lucifer",
//   title: "Cunning Cat",
//   characteristics: ["storyborn", "ally"],
//   text: "**MOUSE CATCHER** When you play this character, each opponent chooses and discards either 2 cards or 1 action card.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Mouse Catcher",
//       text: "When you play this character, each opponent chooses and discards either 2 cards or 1 action card.",
//       responder: "opponent",
//       effects: [
//         {
//           type: "discard",
//           amount: 1,
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               responder: "opponent",
//               filters: [{ filter: "type", value: ["action"], negate: true }],
//               // TODO: get rid of target
//               target: thisCharacter,
//               effects: [discardACard],
//             },
//           ],
//           target: {
//             type: "card",
//             value: 1,
//             upTo: true,
//             filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: '"There must be something good about him." \\n−Cinderella',
//   colors: ["emerald"],
//   cost: 5,
//   strength: 2,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Isabella Ceravolo",
//   number: 85,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525103,
//   },
//   rarity: "rare",
// };
//
