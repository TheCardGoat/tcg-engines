import type { StageCard } from "@tcg/op-types";
import { eb01MiniMerry011I18n } from "./011-mini-merry.i18n.ts";

export const eb01MiniMerry011: StageCard = {
  id: "EB01-011",
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "EB01",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[Activate:Main] You may rest this card and place 1 of your Characters with 1000 base power at the bottom of your deck: Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb01MiniMerry011I18n,
};
