import type { CharacterCard } from "@tcg/op-types";
import { op06LilyCarnation015I18n } from "./015-lily-carnation.i18n.ts";

export const op06LilyCarnation015: CharacterCard = {
  id: "OP06-015",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP06",
  cost: 4,
  power: 0,
  counter: 1000,
  traits: ["FILM Omatsuri Island"],
  attribute: "special",
  effect:
    "[Activate:Main][Once Per Turn] You may trash 1 of your Characters with 6000 power or more: Play up to 1 [FILM] type Character card with 2000 to 5000 power from your trash rested.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
            filters: [
              {
                filter: "trait",
                value: "FILM",
              },
            ],
            playState: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06LilyCarnation015I18n,
};
