import type { CharacterCard } from "@tcg/op-types";
import { op14eb04EdwardWeevilEb01023Sp023I18n } from "./023-edward-weevil-eb01-023-sp.i18n.ts";

export const op14eb04EdwardWeevilEb01023Sp023: CharacterCard = {
  id: "EB01-023",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 4,
  power: 6000,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  effect: "[On Play] Draw 1 card.",
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
        ],
      },
    ],
  },
  i18n: op14eb04EdwardWeevilEb01023Sp023I18n,
};
