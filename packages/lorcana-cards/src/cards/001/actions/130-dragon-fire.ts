import type { ActionCard } from "@tcg/lorcana-types";

export const dragonFireundefined: ActionCard = {
  abilities: [
    {
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "buy-1",
      text: "Banish chosen character.",
      type: "action",
    },
  ],
  cardNumber: 130,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Dragon Fire - undefined",
  id: "buy",
  inkType: ["ruby"],
  inkable: true,
  name: "Dragon Fire",
  set: "001",
  text: "Banish chosen character.",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { mayBanish } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const dragonFire: LorcanitoActionCard = {
//   Id: "buy",
//   Reprints: ["nns"],
//   Name: "Dragon Fire",
//   Characteristics: ["action"],
//   Text: "Banish chosen character.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Dragon Fire",
//       Text: "Banish chosen character.",
//       Effects: [mayBanish(chosenCharacter)],
//     },
//   ],
//   Flavour: "Rare is the hero who can withstand a dragon's wrath.",
//   Colors: ["ruby"],
//   Cost: 5,
//   Illustrator: "Luis Huerta",
//   Number: 130,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492710,
//   },
//   Rarity: "uncommon",
// };
//
