import type { ActionCard } from "@tcg/lorcana-types";

export const letTheStormRageOn: ActionCard = {
  id: "16u",
  cardType: "action",
  name: "Let the Storm Rage On",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "002",
  text: "Deal 2 damage to chosen character. Draw a card.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 199,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9a63024ffea386ae54e4ff912373a8ea18fb0eed",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type {
//   CardEffectTarget,
//   PlayerEffectTarget,
// } from "@lorcanito/lorcana-engine/effects/effectTargets";
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
// const drawACard = {
//   type: "draw" as const,
//   amount: 1,
//   target: {
//     type: "player" as const,
//     value: "self" as const,
//   } as PlayerEffectTarget,
// };
//
// export const letTheStormRageOn: LorcanitoActionCard = {
//   id: "dlc",
//   name: "Let the Storm Rage On",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n\nDeal 2 damage to chosen character. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Let the Storm Rage On",
//       text: "Deal 2 damage to chosen character. Draw a card.",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenCharacter,
//         },
//         drawACard,
//       ],
//     },
//   ],
//   flavour: "The cold never bothered me anyway",
//   colors: ["steel"],
//   cost: 3,
//   illustrator: "R. la Barbera / L. Giammichele",
//   number: 199,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527239,
//   },
//   rarity: "common",
// };
//
