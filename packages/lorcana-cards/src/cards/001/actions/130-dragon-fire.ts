import type { ActionCard } from "@tcg/lorcana-types";

export const dragonFireundefined: ActionCard = {
  id: "buy",
  cardType: "action",
  name: "Dragon Fire",
  version: "undefined",
  fullName: "Dragon Fire - undefined",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "Banish chosen character.",
  cost: 5,
  cardNumber: 130,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "buy-1",
      text: "Banish chosen character.",
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
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { mayBanish } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const dragonFire: LorcanitoActionCard = {
//   id: "buy",
//   reprints: ["nns"],
//   name: "Dragon Fire",
//   characteristics: ["action"],
//   text: "Banish chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Dragon Fire",
//       text: "Banish chosen character.",
//       effects: [mayBanish(chosenCharacter)],
//     },
//   ],
//   flavour: "Rare is the hero who can withstand a dragon's wrath.",
//   colors: ["ruby"],
//   cost: 5,
//   illustrator: "Luis Huerta",
//   number: 130,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492710,
//   },
//   rarity: "uncommon",
// };
//
