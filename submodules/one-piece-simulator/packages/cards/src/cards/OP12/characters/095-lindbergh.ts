import type { CharacterCard } from "@tcg/op-types";
import { op12Lindbergh095I18n } from "./095-lindbergh.i18n.ts";

export const op12Lindbergh095: CharacterCard = {
  id: "OP12-095",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Minks Revolutionary Army"],
  attribute: "special",
  effect:
    'If your Leader has the "Revolutionary Army" type, this Character gains +4 cost.\n[On Play] Draw 1 card and trash 1 card from your hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op12Lindbergh095I18n,
};
