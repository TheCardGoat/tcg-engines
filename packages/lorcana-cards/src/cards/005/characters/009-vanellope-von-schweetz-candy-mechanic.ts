import type { CharacterCard } from "@tcg/lorcana-types";

export const vanellopeVonSchweetzCandyMechanic: CharacterCard = {
  id: "18i",
  cardType: "character",
  name: "Vanellope von Schweetz",
  version: "Candy Mechanic",
  fullName: "Vanellope von Schweetz - Candy Mechanic",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "YOU'VE GOT TO PAY TO PLAY Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 9,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a074d9a5fe4ec9e9905316dcc6f56e1a9de0a03b",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const vanellopeVonSchweetzCandyMechanic: LorcanitoCharacterCard = {
//   id: "pvk",
//   name: "Vanellope Von Schweetz",
//   title: "Candy Mechanic",
//   characteristics: ["hero", "dreamborn", "princess", "racer"],
//   text: "**YOU’VE GOT TO PAY TO PLAY** Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "YOU’VE GOT TO PAY TO PLAY",
//       text: "Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "subtract",
//           duration: "next_turn",
//           until: true,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "I’ll take whatever you’ve got... as long as it’s got sugar in it.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Hedvig Häggman-Sund",
//   number: 9,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561946,
//   },
//   rarity: "common",
// };
//
