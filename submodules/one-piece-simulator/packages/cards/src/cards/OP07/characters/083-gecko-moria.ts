import type { CharacterCard } from "@tcg/op-types";
import { op07GeckoMoria083I18n } from "./083-gecko-moria.i18n.ts";

export const op07GeckoMoria083: CharacterCard = {
  id: "OP07-083",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Seven Warlords of the Sea Thriller Bark Pirates"],
  attribute: "special",
  effect:
    "[Activate: Main] You may place 4 [Thriller Bark Pirates] type cards from your trash at the bottom of your deck in any order: This Character gains [Banish] and +1000 power during this turn. (When this card deals damage, the target card is trashed without activating its Trigger.)",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "banish",
            duration: "thisTurn",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07GeckoMoria083I18n,
};
