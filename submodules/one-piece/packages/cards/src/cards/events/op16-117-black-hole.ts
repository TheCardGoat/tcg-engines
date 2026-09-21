import type { EventCard } from "@tcg/op-types";
import { op16BlackHole117I18n } from "./op16-117-black-hole.i18n.ts";

export const op16BlackHole117: EventCard = {
  id: "OP16-117",
  canonicalId: "OP16-117",
  slug: "black-hole/op16-117",
  name: "Black Hole",
  printings: [
    {
      id: "OP16-117",
      artId: "OP16-117",
      setCode: "OP16",
      collectorNumber: "117",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-117_ne8ND2M.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP16",
  cost: 2,
  trigger: "Add up to 1 {Blackbeard Pirates} type card from your trash to your hand.",
  traits: ["Blackbeard Pirates The Seven Warlords of the Sea"],
  effect:
    "[Main] You may trash 1 card with a [Trigger] from your hand: Negate the effects of up to 1 of your opponent's Characters with a cost of 8 or less during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "hasTrigger",
                value: true,
              },
            ],
          },
        ],
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 8,
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op16BlackHole117I18n,
};
