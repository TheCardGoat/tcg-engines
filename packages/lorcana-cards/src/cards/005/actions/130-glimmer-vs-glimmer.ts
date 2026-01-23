import type { ActionCard } from "@tcg/lorcana-types";

export const glimmerVsGlimmer: ActionCard = {
  id: "e3r",
  cardType: "action",
  name: "Glimmer vs Glimmer",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "005",
  text: "Banish chosen character of yours to banish chosen character.",
  cost: 4,
  cardNumber: 130,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "32d58396c6366bd44e37140214651921b4bc231f",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   banishChosenCharacterOfYours,
//   banishChosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const glimmerVsGlimmer: LorcanitoActionCard = {
//   id: "opx",
//   missingTestCase: true,
//   name: "Glimmer VS Glimmer",
//   characteristics: ["action"],
//   text: "Banish chosen character of yours to banish chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       dependentEffects: true,
//       resolveEffectsIndividually: true,
//       effects: [banishChosenOpposingCharacter, banishChosenCharacterOfYours],
//     },
//   ],
//   flavour:
//     'Hades: "Listen, kid. If I’m gettin’ banished back to the lorebook, you’re going with me."\nHercules: "We’ll see about that."',
//   colors: ["ruby"],
//   cost: 4,
//   illustrator: "Ian MacDonald",
//   number: 130,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560548,
//   },
//   rarity: "uncommon",
// };
//
