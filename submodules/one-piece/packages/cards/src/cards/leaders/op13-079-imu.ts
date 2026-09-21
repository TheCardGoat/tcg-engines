import type { LeaderCard } from "@tcg/op-types";
import { op13Imu079I18n } from "./op13-079-imu.i18n.ts";

export const op13Imu079: LeaderCard = {
  id: "OP13-079",
  canonicalId: "OP13-079",
  slug: "imu/op13-079",
  name: "Imu",
  printings: [
    {
      id: "OP13-079",
      artId: "OP13-079",
      setCode: "OP13",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-079_9T9oN7C.jpg",
    },
    {
      id: "OP13-079_p1",
      artId: "OP13-079_p1",
      setCode: "OP13",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-079_p1_ZUsrXMm.jpg",
      label: "Imu (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "OP13",
  power: 5000,
  life: 4,
  traits: ["?"],
  attribute: "?",
  effect:
    "Under the rules of this game, you cannot include Events with a cost of 2 or more in your deck and at the start of the game, play up to 1 [Mary Geoise] type Stage card from your deck.[Activate: Main] [Once Per Turn] You may trash 1 of your [Celestial Dragons] type Characters or 1 card from your hand: Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashCard",
            amount: 1,
            options: [
              {
                zones: ["character"],
                filters: [
                  {
                    filter: "trait",
                    value: "Celestial Dragons",
                    match: "includes",
                  },
                ],
              },
              {
                zones: ["hand"],
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op13Imu079I18n,
};
