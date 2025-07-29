import type { PlayerEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { LoreEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const self: PlayerEffectTarget = {
  type: "player",
  value: "self",
};

export const packTactics: LorcanaActionCardDefinition = {
  id: "yp2",

  name: "Pack Tactics",
  characteristics: ["action"],
  text: "Gain 1 lore for each damaged character opponents have in play.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "lore",
          modifier: "add",
          target: self,
          amount: {
            dynamic: true,
            amount: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
              {
                filter: "status",
                value: "damage",
                comparison: { operator: "gte", value: 1 },
              },
            ],
          },
        } as LoreEffect,
      ],
    },
  ],
  flavour:
    "Pacha: You want to survive the jungle? Start thinking like you belong here. \nKuzco: No problem . . . Grrr, look at me, I'm a jaguar.",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  illustrator: "Don Aguillo",
  number: 100,
  set: "ROF",
  rarity: "rare",
};
