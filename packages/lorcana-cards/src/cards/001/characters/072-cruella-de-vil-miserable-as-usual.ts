import type { CharacterCard } from "@tcg/lorcana-types";
import { moveCards, optional } from "../../ability-helpers";

export const cruellaDeVilMiserableAsUsual: CharacterCard = {
  id: "cw0",
  cardType: "character",
  name: "Cruella De Vil",
  version: "Miserable as Usual",
  fullName: "Cruella De Vil - Miserable as Usual",
  inkType: ["emerald"],
  franchise: "101 Dalmatians",
  set: "001",
  text: "YOU'LL BE SORRY! When this character is challenged and banished, you may return chosen character to their player's hand.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 72,
  inkable: true,
  externalIds: {
    ravensburger: "2e73f0957919d8b91e9c5a66b5c0b5a5ede4afeb",
  },
  abilities: [
    {
      id: "cw0-1",
      text: "YOU'LL BE SORRY! When this character is challenged and banished, you may return chosen character to their player's hand.",
      name: "YOU'LL BE SORRY!",
      type: "triggered",
      trigger: {
        event: "challenged",
        timing: "when",
        on: "SELF",
      },
      effect: optional(
        moveCards("play", "hand", {
          target: "CHOSEN_CHARACTER",
        }),
      ),
    },
  ],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenChallengedAndBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const cruellaDeVilMiserableAsUsual: LorcanitoCharacterCard = {
//   id: "wr1",
//
//   name: "Cruella De Vil",
//   title: "Miserable As Usual",
//   characteristics: ["storyborn", "villain"],
//   text: "**You'll Be Sorry** When this character is challenged and banished, you may return chosen character to their player's hand.",
//   type: "character",
//   abilities: [
//     whenChallengedAndBanished({
//       name: "YOU'LL BE SORRY",
//       text: "When this character is challenged and banished, you may return chosen character to their player's hand.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "When she stops by, misery is company.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Nicholas Kole",
//   number: 72,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492703,
//   },
//   rarity: "rare",
// };
//
