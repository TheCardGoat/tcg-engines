import type { ActionCard } from "@tcg/lorcana-types";

export const workTogether: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Support",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "118-1",
      text: "Chosen character gains Support this turn.",
      type: "static",
    },
  ],
  cardNumber: 165,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "e3a118a64cb987ccb8930d3b51c32bdde97eaea6",
  },
  franchise: "Emperors New Groove",
  id: "118",
  inkType: ["sapphire"],
  inkable: true,
  name: "Work Together",
  set: "001",
  text: "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { chosenCharacterGainsSupport } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const workTogether: LorcanitoActionCard = {
//   Id: "cxh",
//   Name: "Work Together",
//   Characteristics: ["action"],
//   Text: "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Work Together",
//       Text: "Chosen character gains **Support** this turn.",
//       Effects: [chosenCharacterGainsSupport("turn")],
//     },
//   ],
//   Flavour:
//     "Pacha: Put your whole back into it! \nKuzco: This is my whole back!",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 1,
//   Illustrator: "Bill Robinson",
//   Number: 165,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508889,
//   },
//   Rarity: "common",
// };
//
