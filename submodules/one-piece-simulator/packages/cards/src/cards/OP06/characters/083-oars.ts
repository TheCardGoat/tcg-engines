import type { CharacterCard } from "@tcg/op-types";
import { op06Oars083I18n } from "./083-oars.i18n.ts";

export const op06Oars083: CharacterCard = {
  id: "OP06-083",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP06",
  cost: 4,
  power: 7000,
  traits: ["Giant Thriller Bark Pirates"],
  attribute: "strike",
  effect:
    "This Character cannot attack.\n[Activate:Main] You may K.O. 1 of your [Thriller Bark Pirates] type Characters: This Character's effect is negated during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06Oars083I18n,
};
