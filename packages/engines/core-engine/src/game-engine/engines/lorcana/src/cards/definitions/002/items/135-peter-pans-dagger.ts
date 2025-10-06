import type { EffectStaticAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peterPansDagger: LorcanaItemCardDefinition = {
  id: "z0a",

  name: "Peter Pan's Dagger",
  characteristics: ["item"],
  text: "Your characters with **Evasive** get +1 {S}.",
  type: "item",
  abilities: [
    {
      type: "static",
      ability: "effects",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          duration: "static",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "ability", value: "evasive" },
            ],
          },
        },
      ],
    } as EffectStaticAbility,
  ],
  flavour:
    "Like so much other lore, Peter Pan's dagger was safe in the Great Illuminary until the flood.",
  colors: ["ruby"],
  cost: 2,
  illustrator: "Leonardo Giammichele",
  number: 135,
  set: "ROF",
  rarity: "common",
};
