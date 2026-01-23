import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaIceSurfer: CharacterCard = {
  id: "a9h",
  cardType: "character",
  name: "Elsa",
  version: "Ice Surfer",
  fullName: "Elsa - Ice Surfer",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**THAT",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 109,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Hero", "Dreamborn", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const elsaIceSurfer: LorcanitoCharacterCard = {
//   id: "a9h",
//   name: "Elsa",
//   title: "Ice Surfer",
//   characteristics: ["hero", "dreamborn", "queen", "sorcerer"],
//   text: "**THAT'S NO BLIZZARD** Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     wheneverPlays({
//       name: "THAT'S NO BLIZZARD",
//       text: "Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "owner", value: "self" },
//           {
//             filter: "attribute",
//             value: "name",
//             comparison: { operator: "eq", value: "Anna" },
//           },
//         ],
//       },
//       effects: readyAndCantQuest({
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//           {
//             filter: "attribute",
//             value: "name",
//             comparison: { operator: "eq", value: "Elsa" },
//           },
//         ],
//       }),
//     }),
//   ],
//   flavour:
//     "My sister has always been there for me. I need to be there for her.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 109,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507482,
//   },
//   rarity: "common",
// };
//
