import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicMirror: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "bql",
  reprints: ["z3v"],

  name: "Magic Mirror",
  text: "**Speak** {E}, 4 {I} - Draw a card.",
  type: "item",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "exert" }, { type: "ink", amount: 4 }],
      name: "Speak",
      text: "{E}, 4 {I} - Draw a card.",
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
    } as ActivatedAbility,
  ],
  flavour: '"What wouldst thou know, my Queen?"',
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Andrew Trabbold",
  number: 66,
  set: "TFC",
  rarity: "rare",
};
