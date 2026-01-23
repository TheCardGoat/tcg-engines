import type { CharacterCard } from "@tcg/lorcana-types";

export const ramaVigilantFather: CharacterCard = {
  id: "1d1",
  cardType: "character",
  name: "Rama",
  version: "Vigilant Father",
  fullName: "Rama - Vigilant Father",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "010",
  text: "PROTECTION OF THE PACK Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 109,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b0cb45307725aa8afa6fc53b41b723d92b4a6c0a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ramaVigilantFather: LorcanitoCharacterCard = {
//   id: "jd0",
//   name: "Rama",
//   title: "Vigilant Father",
//   characteristics: ["storyborn", "ally"],
//   text: "PROTECTION OF THE PACK Whenever you play another character with 5 or more {S}, you may ready this character. If you do, he can't quest for the rest of this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 6,
//   strength: 6,
//   willpower: 6,
//   illustrator: "Shavrin Ivan",
//   number: 109,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659600,
//   },
//   rarity: "common",
//   abilities: [
//     wheneverPlays({
//       name: "PROTECTION OF THE PACK",
//       text: "Whenever you play another character with 5 or more {S}, you may ready this character. If you do, he can't quest for the rest of this turn.",
//       optional: true,
//       excludeSelf: true,
//       triggerTarget: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           {
//             filter: "attribute",
//             value: "strength",
//             comparison: { operator: "gte", value: 5 },
//           },
//         ],
//       },
//       effects: readyAndCantQuest(thisCharacter),
//     }),
//   ],
//   lore: 2,
// };
//
