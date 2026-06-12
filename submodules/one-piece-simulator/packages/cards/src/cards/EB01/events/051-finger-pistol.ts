import type { EventCard } from "@tcg/op-types";
import { eb01FingerPistol051I18n } from "./051-finger-pistol.i18n.ts";

export const eb01FingerPistol051: EventCard = {
  id: "EB01-051",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "EB01",
  cost: 4,
  traits: ["CP9"],
  effect:
    "[Main] You may trash 2 cards from the top of your deck: K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb01FingerPistol051I18n,
};
