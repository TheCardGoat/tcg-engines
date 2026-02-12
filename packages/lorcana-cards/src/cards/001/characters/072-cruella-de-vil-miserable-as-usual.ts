import type { CharacterCard } from "@tcg/lorcana-types";

export const cruellaDeVilMiserableAsUsual: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "cw0-1",
      name: "YOU'LL BE SORRY!",
      text: "YOU'LL BE SORRY! When this character is challenged and banished, you may return chosen character to their player's hand.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 72,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 2,
  externalIds: {
    ravensburger: "2e73f0957919d8b91e9c5a66b5c0b5a5ede4afeb",
  },
  franchise: "101 Dalmatians",
  fullName: "Cruella De Vil - Miserable as Usual",
  id: "cw0",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  name: "Cruella De Vil",
  set: "001",
  strength: 1,
  text: "YOU'LL BE SORRY! When this character is challenged and banished, you may return chosen character to their player's hand.",
  version: "Miserable as Usual",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenChallengedAndBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const cruellaDeVilMiserableAsUsual: LorcanitoCharacterCard = {
//   Id: "wr1",
//
//   Name: "Cruella De Vil",
//   Title: "Miserable As Usual",
//   Characteristics: ["storyborn", "villain"],
//   Text: "**You'll Be Sorry** When this character is challenged and banished, you may return chosen character to their player's hand.",
//   Type: "character",
//   Abilities: [
//     WhenChallengedAndBanished({
//       Name: "YOU'LL BE SORRY",
//       Text: "When this character is challenged and banished, you may return chosen character to their player's hand.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   Flavour: "When she stops by, misery is company.",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Nicholas Kole",
//   Number: 72,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492703,
//   },
//   Rarity: "rare",
// };
//
