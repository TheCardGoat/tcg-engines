import type { EventCard } from "@tcg/op-types";
import { eb02Germa66039I18n } from "./039-germa-66.i18n.ts";

export const eb02Germa66039: EventCard = {
  id: "EB02-039",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "EB02",
  cost: 4,
  traits: ["The Vinsmoke Family GERMA 66"],
  effect:
    '[Main] You may trash 1 "GERMA 66" type Character card with 4000 power or less from your hand: If the number of DON!! cards on your field is equal to or less than the number on your opponent\'s field, play up to 1 Character card with 5000 to 7000 power and the same card name as the trashed card from your trash.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02Germa66039I18n,
};
