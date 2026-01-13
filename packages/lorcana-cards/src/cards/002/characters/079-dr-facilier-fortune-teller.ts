import type { CharacterCard } from "@tcg/lorcana-types";

export const drFacilierFortuneTeller: CharacterCard = {
  id: "h8r",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Fortune Teller",
  fullName: "Dr. Facilier - Fortune Teller",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nYOU'RE IN MY WORLD Whenever this character quests, chosen opposing character can't quest during their next turn.",
  cost: 7,
  strength: 4,
  willpower: 4,
  lore: 3,
  cardNumber: 79,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3e258200882f4b5dcbec8289f3c82c2c45974698",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { CardRestrictionEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const drFacilierFortuneTeller: LorcanitoCharacterCard = {
//   id: "mwx",
//
//   name: "Dr. Facilier",
//   title: "Fortune Teller",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**Evasive** (_Only characters with Evasive can challenge this character._)\n**YOU'RE IN MY WORLD** Whenever this character quests, chosen opposing character can't quest during their next turn.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     wheneverQuests({
//       name: "You're in my World",
//       text: "Whenever this character quests, chosen opposing character can't quest during their next turn.",
//       effects: [
//         {
//           type: "restriction",
//           restriction: "quest",
//           duration: "next_turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         } as CardRestrictionEffect,
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 7,
//   strength: 4,
//   willpower: 4,
//   lore: 3,
//   illustrator: "Ron Baird",
//   number: 79,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527745,
//   },
//   rarity: "super_rare",
// };
//
