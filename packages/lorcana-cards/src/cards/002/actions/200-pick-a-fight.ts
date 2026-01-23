import type { ActionCard } from "@tcg/lorcana-types";

export const pickAFight: ActionCard = {
  id: "zph",
  cardType: "action",
  name: "Pick a Fight",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "002",
  text: "Chosen character can challenge ready characters this turn.",
  cost: 2,
  cardNumber: 200,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "80b19310099db7717fc69d00ac3c45f408c38276",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//   ],
// };
//
// export const pickAFight: LorcanitoActionCard = {
//   id: "mmh",
//
//   name: "Pick a Fight",
//   characteristics: ["action"],
//   text: "Chosen character can challenge ready characters this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Pick a Fight",
//       text: "Chosen character can challenge ready characters this turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "challenge_ready_chars",
//           modifier: "add",
//           duration: "turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "I'm gonna wreck it!",
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Pablo Hidalgo / Jeff Merghart",
//   number: 200,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527296,
//   },
//   rarity: "uncommon",
// };
//
