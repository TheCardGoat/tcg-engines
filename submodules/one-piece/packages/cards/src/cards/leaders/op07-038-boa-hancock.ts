import type { LeaderCard } from "@tcg/op-types";
import { op07BoaHancock038I18n } from "./op07-038-boa-hancock.i18n.ts";

export const op07BoaHancock038: LeaderCard = {
  id: "OP07-038",
  canonicalId: "OP07-038",
  slug: "boa-hancock/op07-038",
  name: "Boa Hancock",
  printings: [
    {
      id: "OP07-038",
      artId: "OP07-038",
      setCode: "OP07",
      collectorNumber: "038",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-038.jpg",
    },
    {
      id: "OP07-038_p1",
      artId: "OP07-038_p1",
      setCode: "OP07",
      collectorNumber: "038",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-038_p1.jpg",
    },
    {
      id: "OP07-038_p2",
      artId: "OP07-038_p2",
      setCode: "OP07",
      collectorNumber: "038",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-038_p2.jpg",
      label: "Boa Hancock (SPR)",
    },
  ],
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "OP07",
  power: 5000,
  life: 5,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",

  effect:
    "[Your Turn] [Once Per Turn] This effect can be activated when a Character is removed from the field by your effect. If you have 5 or less cards in your hand, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenLeaving",
        eventFilter: {
          causedBy: "self",
        },
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
        optional: true,
      },
    ],
  },
  i18n: op07BoaHancock038I18n,
};
