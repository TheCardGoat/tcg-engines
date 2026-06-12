import type { CharacterCard } from "@tcg/op-types";
import { prb02BlackMariaReprint074I18n } from "./074-black-maria-reprint.i18n.ts";

export const prb02BlackMariaReprint074: CharacterCard = {
  id: "OP08-074",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "PRB02",
  cost: 3,
  power: 2000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  effect:
    '[Activate:Main] [Once Per Turn] If you have no other [Black Maria] Characters, add up to 5 DON!! cards from your DON!! deck and rest them. Then, at the end of this turn, return DON!! cards from your field to your DON!! deck until you have the same number of DON!! cards on your field as your opponent.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "notHasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "name",
                value: "Black Maria",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 5,
              upTo: true,
            },
            state: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02BlackMariaReprint074I18n,
};
