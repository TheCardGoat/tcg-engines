import type { EventCard } from "@tcg/op-types";
import { op10GodThread079I18n } from "./079-god-thread.i18n.ts";

export const op10GodThread079: EventCard = {
  id: "OP10-079",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP10",
  cost: 5,
  trigger: "Add up to 1 DON!! card from your DON!! deck and set it as active.",
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with a cost 5 or less. Then, add up to 1 DON!! card from your DON!! deck and set it as active.",
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
    ],
  },
  i18n: op10GodThread079I18n,
};
