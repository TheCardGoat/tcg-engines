import type {
  AttributeEffect,
  TargetConditionalEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const targetingAladdin: AttributeEffect = {
  type: "attribute",
  attribute: "strength",
  amount: 2,
  modifier: "add",
  duration: "turn",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
      {
        filter: "attribute",
        value: "name",
        comparison: { operator: "eq", value: "aladdin" },
      },
    ],
  },
};

const notTargetingAladdin: AttributeEffect = {
  type: "attribute",
  attribute: "strength",
  amount: 1,
  modifier: "add",
  duration: "turn",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
    ],
  },
};

export const stolenScimitar: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "h98",

  name: "Stolen Scimitar",
  text: "**SLASH** {E} − Chosen character get +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Slash",
      text: "Chosen character get +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "target-conditional",
          autoResolve: false,
          // move condition to a separate object, so the filter is the same
          effects: [targetingAladdin],
          fallback: [notTargetingAladdin],
          // TODO: Re implement conditional target
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "aladdin" },
              },
            ],
          },
        } as TargetConditionalEffect,
      ],
    } as ActivatedAbility,
  ],
  flavour: "Sometimes you've got to take what you can get.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Kendall Hale",
  number: 102,
  set: "TFC",
  rarity: "common",
};
