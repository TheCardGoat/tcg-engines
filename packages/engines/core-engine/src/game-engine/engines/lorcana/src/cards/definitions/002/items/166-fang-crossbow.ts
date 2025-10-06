import type { CardEffectTarget } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};

export const fangCrossbow: LorcanaItemCardDefinition = {
  id: "ob5",

  name: "Fang Crossbow",
  characteristics: ["item"],
  text: "**CAREFUL AIM** {E}, 2 {I} – Chosen character gets -2 {S} this turn.\n\n**STAY BACK!** {E}, Banish this item – Banish chosen Dragon character.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Careful Aim",
      text: "{E}, 2 {I} – Chosen character gets -2 {S} this turn.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "subtract",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
    {
      type: "activated",
      name: "Stay Back!",
      text: "{E}, Banish this item – Banish chosen Dragon character.",
      costs: [{ type: "exert" }, { type: "banish" }],
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "characteristics", value: ["dragon"] },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Antonia Flechsig",
  number: 166,
  set: "ROF",
  rarity: "uncommon",
};
