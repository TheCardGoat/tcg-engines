import type { EventCard } from "@tcg/op-types";
import { op14eb04CrescentCutlass098I18n } from "./098-crescent-cutlass.i18n.ts";

export const op14eb04CrescentCutlass098: EventCard = {
  id: "OP14-098",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  traits: ["Impel Down Former Baroque Works"],
  effect:
    '[Main] If there is a Character with a cost of 0 or with a cost of 8 or more, all of your Characters with a type including "Baroque Works" gain +3 cost until the end of your opponent\'s next End Phase. [Counter] Your Leader gains +3000 power during this battle.',
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op14eb04CrescentCutlass098I18n,
};
