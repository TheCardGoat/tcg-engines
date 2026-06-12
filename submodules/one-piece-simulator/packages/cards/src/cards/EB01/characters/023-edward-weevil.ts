import type { CharacterCard } from "@tcg/op-types";
import { eb01EdwardWeevil023I18n } from "./023-edward-weevil.i18n.ts";

export const eb01EdwardWeevil023: CharacterCard = {
  id: "EB01-023",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "EB01",
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
  i18n: eb01EdwardWeevil023I18n,
};
