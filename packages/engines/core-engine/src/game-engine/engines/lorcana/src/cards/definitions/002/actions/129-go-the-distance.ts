import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
import type { PlayerEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";

const self: PlayerEffectTarget = {
  type: "player",
  value: "self",
};

export const goTheDistance: LorcanitoActionCard = {
  id: "k1y",

  name: "Go the Distance",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nReady chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        ...readyAndCantQuest({
          type: "card",
          value: 1,
          filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            {
              filter: "status",
              value: "damage",
              comparison: { operator: "gte", value: 1 },
            },
          ],
        }),
        {
          type: "draw",
          amount: 1,
          target: self,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Gaku Kumatori",
  number: 129,
  set: "ROF",
  rarity: "common",
};
