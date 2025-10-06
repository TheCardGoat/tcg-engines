import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const whiteRabbitPocketWatch: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "u45",
  reprints: ["u14"],

  name: "White Rabbit's Pocket Watch",
  text: "**I'm late!** {E}, 1 {I} - Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "I'm late!",
      text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
      costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
      effects: [
        {
          type: "ability",
          ability: "rush",
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
            ],
          },
        } as AbilityEffect,
      ],
    } as ActivatedAbility,
  ],
  flavour:
    '"No wonder you\'re late. Why, this clock is exactly two days slow." −The Mad Hatter',
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Kamil Murzyn",
  number: 68,
  set: "TFC",
  rarity: "rare",
};
