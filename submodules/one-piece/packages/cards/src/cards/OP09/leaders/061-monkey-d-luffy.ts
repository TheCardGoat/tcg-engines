import type { LeaderCard } from "@tcg/op-types";
import { op09MonkeyDLuffy061I18n } from "./061-monkey-d-luffy.i18n.ts";

export const op09MonkeyDLuffy061: LeaderCard = {
  id: "OP09-061",
  canonicalId: "OP09-061",
  slug: "monkey-d-luffy/op09-061",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP09-061",
      artId: "OP09-061",
      setCode: "OP09",
      collectorNumber: "061",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-061.jpg",
    },
    {
      id: "OP09-061_p1",
      artId: "OP09-061_p1",
      setCode: "OP09",
      collectorNumber: "061",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-061_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["purple", "black"],
  rarity: "L",
  setId: "OP09",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew The Four Emperors"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-061_p1.jpg",
      imageId: "OP09-061_p1",
    },
  ],
  effect:
    "[DON!! x1] All of your Characters gain +1 cost.\n[Your Turn] [Once Per Turn] When 2 or more DON!! cards on your field are returned to your DON!! deck, add up to 1 DON!! card from your DON!! deck and set it as active, and add up to 1 additional DON!! card and rest it.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        eventFilter: { minimumAmount: 2 },
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
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
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: 1,
          },
        ],
      },
    ],
  },
  i18n: op09MonkeyDLuffy061I18n,
};
