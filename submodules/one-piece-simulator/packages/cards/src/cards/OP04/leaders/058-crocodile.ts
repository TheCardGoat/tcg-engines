import type { LeaderCard } from "@tcg/op-types";
import { op04Crocodile058I18n } from "./058-crocodile.i18n.ts";

export const op04Crocodile058: LeaderCard = {
  id: "OP04-058",
  cardType: "leader",
  color: ["purple", "yellow"],
  rarity: "L",
  setId: "OP04",
  power: 5000,
  life: 4,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-058_p1.jpg",
      imageId: "OP04-058_p1",
    },
  ],
  effect:
    "[Opponent's Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck by your effect, add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
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
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op04Crocodile058I18n,
};
