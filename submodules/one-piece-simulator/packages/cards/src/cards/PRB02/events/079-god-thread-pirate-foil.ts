import type { EventCard } from "@tcg/op-types";
import { prb02GodThreadPirateFoil079I18n } from "./079-god-thread-pirate-foil.i18n.ts";

export const prb02GodThreadPirateFoil079: EventCard = {
  id: "OP10-079",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "PRB02",
  cost: 5,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-079_r1.jpg",
      imageId: "OP10-079_r1",
    },
  ],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with a cost 5 or less. Then, add up to 1 DON!! card from your DON!! deck and set it as active.[Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: prb02GodThreadPirateFoil079I18n,
};
