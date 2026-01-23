import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderCharmingRogue: CharacterCard = {
  id: "qk8",
  cardType: "character",
  name: "Flynn Rider",
  version: "Charming Rogue",
  fullName: "Flynn Rider - Charming Rogue",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "001",
  text: "HERE COMES THE SMOLDER Whenever this character is challenged, the challenging player chooses and discards a card.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 74,
  inkable: true,
  externalIds: {
    ravensburger: "5fbb4404791aacf38f1c7a5736e154eb4a398b23",
  },
  abilities: [
    {
      id: "qk8-1",
      text: "HERE COMES THE SMOLDER Whenever this character is challenged, the challenging player chooses and discards a card.",
      name: "HERE COMES THE SMOLDER",
      type: "triggered",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "discard",
        amount: 1,
        target: "CONTROLLER",
        chosen: true,
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const flynnRiderCharmingRogue: LorcanitoCharacterCard = {
//   id: "pth",
//   name: "Flynn Rider",
//   title: "Charming Rogue",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**HERE COMES THE SMOLDER** Whenever this character is challenged, the challenging player chooses and discards a card.",
//   type: "character",
//   abilities: [
//     whenChallenged({
//       name: "Here Comes The Smolder",
//       text: "Whenever this character is challenged, the challenging player chooses and discards a card.",
//       responder: "opponent",
//       effects: [discardACard],
//     }),
//   ],
//   flavour:
//     "I didn't want to have to do this, but you leave me no choice. . . .",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Leonardo Giammichele",
//   number: 74,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 506833,
//   },
//   rarity: "uncommon",
// };
//
