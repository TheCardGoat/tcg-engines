import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { EffectTargets } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beastMirror: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "ysg",
  reprints: ["ysy"],

  name: "Beast's Mirror",
  text: "**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Show Me",
      text: "If you have no cards in your hand, draw a card.",
      costs: [{ type: "exert" }, { type: "ink", amount: 3 }],
      effects: [
        {
          type: "draw",
          amount: 1,
          target: {
            type: "player",
            value: "self",
          } as EffectTargets,
        },
      ],
      conditions: [
        {
          type: "hand",
          amount: 0,
        },
      ],
    } as ActivatedAbility,
  ],
  flavour:
    "Ashamed of his monstrous form, the Beast concealed himself inside his castle, with a magic mirror as his only window to the outside world.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Samanta Erdini",
  number: 201,
  set: "TFC",
  rarity: "common",
};
