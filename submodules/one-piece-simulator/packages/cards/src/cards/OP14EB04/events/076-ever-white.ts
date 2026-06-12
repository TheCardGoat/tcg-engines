import type { EventCard } from "@tcg/op-types";
import { op14eb04EverWhite076I18n } from "./076-ever-white.i18n.ts";

export const op14eb04EverWhite076: EventCard = {
  id: "OP14-076",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  effect:
    "[Main] You may rest 2 of your DON!! cards: If your Leader has the {Donquixote Pirates} type, add up to 1 DON!! card from your DON!! deck and rest it.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Donquixote Pirates",
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
        optional: true,
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op14eb04EverWhite076I18n,
};
