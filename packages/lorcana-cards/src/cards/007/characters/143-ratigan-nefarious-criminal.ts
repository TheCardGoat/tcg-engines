import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganNefariousCriminal: CharacterCard = {
  id: "8q4",
  cardType: "character",
  name: "Ratigan",
  version: "Nefarious Criminal",
  fullName: "Ratigan - Nefarious Criminal",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "007",
  text: "A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 143,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1f72b455c62ec192fa0b46a65aa7a58a6ff89147",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ratiganNefariousCriminal: LorcanitoCharacterCard = {
//   id: "kod",
//   name: "Ratigan",
//   title: "Nefarious Criminal",
//   characteristics: ["storyborn", "villain"],
//   text: "A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.",
//   type: "character",
//   abilities: [
//     wheneverPlays({
//       name: "A MARVELOUS PERFORMANCE",
//       text: "Whenever you play an action while this character is exerted, gain 1 lore.",
//       conditions: [{ type: "exerted" }],
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["action"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       effects: [youGainLore(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Max Ulichney",
//   number: 143,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619487,
//   },
//   rarity: "legendary",
//   lore: 1,
// };
//
