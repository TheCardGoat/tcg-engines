import type { CharacterCard } from "@tcg/lorcana-types";

export const cogsworthMajordomo: CharacterCard = {
  id: "dww",
  cardType: "character",
  name: "Cogsworth",
  version: "Majordomo",
  fullName: "Cogsworth - Majordomo",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "AS YOU WERE! Whenever this character quests, you may give chosen character -2 {S} until the start of your next turn.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 5,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3225996784e0ecf1d2e3ede2843e1e878b509c25",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const cogsworthMajordomo: LorcanitoCharacterCard = {
//   id: "kfo",
//   name: "Cogsworth",
//   title: "Majordomo",
//   characteristics: ["dreamborn", "ally"],
//   text: "**AS YOU WERE!** Whenever this character quests, you may give chosen character -2 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "AS YOU WERE!",
//       text: "Whenever this character quests, you may give chosen character -2 {S} until the start of your next turn.",
//       optional: true,
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "subtract",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "If it's a fight they want, we'll be ready for them.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Jeodo Neurhaffer",
//   number: 5,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550554,
//   },
//   rarity: "common",
// };
//
