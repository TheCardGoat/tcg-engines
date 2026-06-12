import type { CharacterCard } from "@tcg/op-types";
import { op08Kingdew044I18n } from "./044-kingdew.i18n.ts";

export const op08Kingdew044: CharacterCard = {
  id: "OP08-044",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP08",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    '[Activate:Main] [Once Per Turn] You may reveal 2 cards with a type including "Whitebeard Piratess" from your hand: This Character gains +2000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
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
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08Kingdew044I18n,
};
