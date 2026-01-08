import type { ItemCard } from "@tcg/lorcana-types";

export const mysticalRose: ItemCard = {
  id: "1il",
  cardType: "item",
  name: "Mystical Rose",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "DISPEL THE ENTANGLEMENT Banish this item — Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
  cost: 2,
  cardNumber: 64,
  inkable: true,
  externalIds: {
    ravensburger: "c4c4f0e3ace8d22946df975891f7711d501b13c5",
  },
  abilities: [
    {
      id: "1il-1",
      text: "DISPEL THE ENTANGLEMENT Banish this item — Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
      name: "DISPEL THE ENTANGLEMENT",
      type: "activated",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 0,
            target: {
              selector: "chosen",
              filter: [{ type: "has-name", name: "Beast" }],
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "conditional",
            condition: {
              type: "has-named-character",
              name: "Belle",
              controller: "you",
            },
            then: {
              type: "move-damage",
              amount: 0,
              from: {
                selector: "chosen",
                count: 1,
              },
              to: {
                selector: "chosen",
                owner: "opponent",
                count: 1,
              },
            },
          },
        ],
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   getLoreThisTurn,
//   moveDamageEffect,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mysticalRose: LorcanitoItemCard = {
//   id: "d8l",
//   missingTestCase: true,
//   name: "Mystical Rose",
//   characteristics: ["item"],
//   text: "**DISPEL THE ENTANGLEMENT** Banish this item − Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       costs: [{ type: "banish" }],
//       name: "Dispel The Entanglement",
//       text: "Banish this item − Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
//       effects: [
//         getLoreThisTurn(2, {
//           type: "card",
//           value: 1,
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             {
//               filter: "attribute",
//               value: "name",
//               comparison: { operator: "eq", value: "beast" },
//             },
//           ],
//         }),
//         moveDamageEffect({
//           amount: 3,
//           from: chosenCharacter,
//           to: chosenOpposingCharacter,
//           conditions: [ifYouHaveCharacterNamed("belle")],
//         }),
//       ],
//     },
//   ],
//   flavour:
//     "Ink surrounded Belle's last hope to heal the Beast. With no other choice, she reached out for it . . .",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Olivier Désirée",
//   number: 64,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547683,
//   },
//   rarity: "rare",
// };
//
