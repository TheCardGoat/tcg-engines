import type { LeaderCard } from "@tcg/op-types";
import { eb02BoaHancock038I18n } from "./038-boa-hancock.i18n.ts";

export const eb02BoaHancock038: LeaderCard = {
  id: "OP07-038",
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 5,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "[Your Turn] [Once Per Turn] This effect can be activated when a Character is removed from the field by your effect. If you have 5 or less cards in your hand, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenLeaving",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb02BoaHancock038I18n,
};
