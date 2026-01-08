import type { ItemCard } from "@tcg/lorcana-types";

export const ursulaundefined: ItemCard = {
  id: "fkd",
  cardType: "item",
  name: "Ursula",
  version: "undefined",
  fullName: "Ursula - undefined",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**PEER INTO THE DEPTHS** {E} − Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  cost: 2,
  cardNumber: 67,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**PEER INTO THE DEPTHS** {E} − Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      id: "fkd-1",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look-at-cards",
            amount: 2,
            from: "top-of-deck",
            target: "CONTROLLER",
          },
          {
            type: "put-on-bottom",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { putOneOnTheTopAndTheOtherOnTheBottomOfYourDeck } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ursulaCaldron: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "fkd",
//
//   name: "Ursula's Cauldron",
//   text: "**PEER INTO THE DEPTHS** {E} − Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Peer Into The Depths",
//       text: "{E} − Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
//       costs: [{ type: "exert" }],
//       effects: [putOneOnTheTopAndTheOtherOnTheBottomOfYourDeck],
//     } as ActivatedAbility,
//   ],
//   flavour: "Perfect for mixing potions and stealing voices.",
//   colors: ["amethyst"],
//   cost: 2,
//   number: 67,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507851,
//   },
//   rarity: "uncommon",
//   illustrator: "TBD",
// };
//
