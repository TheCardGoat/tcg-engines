import type { CharacterCard } from "@tcg/op-types";
import { op07Itomimizu060I18n } from "./060-itomimizu.i18n.ts";

export const op07Itomimizu060: CharacterCard = {
  id: "OP07-060",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP07",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Foxy Pirates"],
  attribute: "wisdom",
  effect:
    "[Activate: Main][Once Per Turn] If your Leader has the [Foxy Pirates] type and you have no other [Itomimizu], add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Foxy Pirates",
              },
              {
                condition: "notHasCard",
                player: "self",
                zone: "field",
                filters: [
                  {
                    filter: "name",
                    value: "Itomimizu",
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07Itomimizu060I18n,
};
