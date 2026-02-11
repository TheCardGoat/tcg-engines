import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderCharmingRogue: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "discard",
        amount: 1,
        target: "CONTROLLER",
        chosen: true,
      },
      id: "qk8-1",
      name: "HERE COMES THE SMOLDER",
      text: "HERE COMES THE SMOLDER Whenever this character is challenged, the challenging player chooses and discards a card.",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 74,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 2,
  externalIds: {
    ravensburger: "5fbb4404791aacf38f1c7a5736e154eb4a398b23",
  },
  franchise: "Tangled",
  fullName: "Flynn Rider - Charming Rogue",
  id: "qk8",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  name: "Flynn Rider",
  set: "001",
  strength: 1,
  text: "HERE COMES THE SMOLDER Whenever this character is challenged, the challenging player chooses and discards a card.",
  version: "Charming Rogue",
  willpower: 2,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const flynnRiderCharmingRogue: LorcanitoCharacterCard = {
//   Id: "pth",
//   Name: "Flynn Rider",
//   Title: "Charming Rogue",
//   Characteristics: ["hero", "storyborn", "prince"],
//   Text: "**HERE COMES THE SMOLDER** Whenever this character is challenged, the challenging player chooses and discards a card.",
//   Type: "character",
//   Abilities: [
//     WhenChallenged({
//       Name: "Here Comes The Smolder",
//       Text: "Whenever this character is challenged, the challenging player chooses and discards a card.",
//       Responder: "opponent",
//       Effects: [discardACard],
//     }),
//   ],
//   Flavour:
//     "I didn't want to have to do this, but you leave me no choice. . . .",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 2,
//   Lore: 2,
//   Illustrator: "Leonardo Giammichele",
//   Number: 74,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 506833,
//   },
//   Rarity: "uncommon",
// };
//
