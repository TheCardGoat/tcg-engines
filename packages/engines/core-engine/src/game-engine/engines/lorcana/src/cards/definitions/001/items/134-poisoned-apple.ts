import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type {
  CardEffectTarget,
  ExertEffect,
  TargetConditionalEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

export const poisonedApple: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "g0y",

  name: "Poisoned Apple",
  text: "**TAKE A BITE . . . ** 1 {I}, Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Poisoned Apple",
      text: "Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.",
      costs: [{ type: "banish" }, { type: "ink", amount: 1 }],
      effects: [
        {
          type: "target-conditional",
          autoResolve: false,
          // TODO: RE implement conditional target, this is not correct
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "characteristics", value: ["princess"] },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
          effects: [
            {
              type: "banish",
              target: {
                type: "card",
                value: 1,
                filters: [
                  { filter: "characteristics", value: ["princess"] },
                  { filter: "type", value: "character" },
                  { filter: "zone", value: "play" },
                ],
              },
            },
          ],
          fallback: [
            {
              type: "exert",
              exert: true,
              target: chosenCharacter,
            } as ExertEffect,
          ],
        } as TargetConditionalEffect,
      ],
    } as ActivatedAbility,
  ],
  flavour:
    "One taste of the poisoned apple, and the victim's eyes will close forever. . . . \n−The Queen",
  colors: ["ruby"],
  cost: 3,
  illustrator: "Andrew Trabbold",
  number: 134,
  set: "TFC",
  rarity: "rare",
};
