import type { LeaderCard } from "@tcg/op-types";
import { op15Enel058I18n } from "./op15-058-enel.i18n.ts";

export const op15Enel058: LeaderCard = {
  id: "OP15-058",
  canonicalId: "OP15-058",
  slug: "enel/op15-058",
  name: "Enel",
  printings: [
    {
      id: "OP15-058",
      artId: "OP15-058",
      setCode: "OP15",
      collectorNumber: "058",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-058_xCLoZVA.jpg",
      label: "Enel (OP15-058)",
    },
    {
      id: "OP15-058_p1",
      artId: "OP15-058_p1",
      setCode: "OP15",
      collectorNumber: "058",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-058_p1_LSBUdxM.jpg",
      label: "Enel (OP15-058) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "OP15",
  power: 5000,
  life: 5,
  traits: ["Sky Island"],
  attribute: "special",
  effect:
    "Under the rules of this game, your DON!! deck consists of 6 cards.\n[Activate: Main] [Once Per Turn] If it is your second turn or later, add up to 1 DON!! card from your DON!! deck and set it as active, and add up to 4 additional DON!! cards and rest them. Then, give up to 4 rested DON!! cards to 1 of your Characters.",
  effects: {
    deckBuildingRules: [{ rule: "donDeckCount", count: 6 }],
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "playerTurnCount",
            comparison: "gte",
            value: 2,
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
              amount: 4,
              upTo: true,
            },
            state: "rested",
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 4,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op15Enel058I18n,
};
