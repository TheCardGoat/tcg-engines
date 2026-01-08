import type { ActionCard } from "@tcg/lorcana-types";

export const fallingDownTheRabbitHole: ActionCard = {
  id: "iug",
  cardType: "action",
  name: "Falling Down the Rabbit Hole",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
  cost: 4,
  cardNumber: 162,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "43ec3764557b471a737bf6e14efe6af0e840d0f8",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacterOfYour: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "owner", value: "self" },
//   ],
// };
//
// export const fallingDownTheRabbitHole: LorcanitoActionCard = {
//   id: "j9g",
//   name: "Falling Down the Rabbit Hole",
//   characteristics: ["action"],
//   text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Falling Down the Rabbit Hole",
//       text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
//       responder: "self",
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: chosenCharacterOfYour,
//         },
//       ],
//     },
//     {
//       type: "resolution",
//       name: "Falling Down the Rabbit Hole",
//       text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
//       responder: "opponent",
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: chosenCharacterOfYour,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "Down, down, down she went, floating in a swirl of ink. How curious!",
//   colors: ["sapphire"],
//   cost: 4,
//   illustrator: "Lissette Carrera",
//   number: 162,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526208,
//   },
//   rarity: "rare",
// };
//
