import type { CharacterCard } from "@tcg/op-types";
import { op08BlackMaria074I18n } from "./074-black-maria.i18n.ts";

export const op08BlackMaria074: CharacterCard = {
  id: "OP08-074",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP08",
  cost: 3,
  power: 2000,
  counter: 2000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-074_p1.jpg",
      imageId: "OP08-074_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] If you have no other [Black Maria] Characters, add up to 5 DON!! cards from your DON!! deck and rest them. Then, at the end of this turn, return DON!! cards from your field to your DON!! deck until you have the same number of DON!! cards on your field as your opponent.",
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
  i18n: op08BlackMaria074I18n,
};
