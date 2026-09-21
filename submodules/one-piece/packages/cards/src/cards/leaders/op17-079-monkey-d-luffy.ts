import type { LeaderCard } from "@tcg/op-types";
import { op17MonkeyDLuffy079I18n } from "./op17-079-monkey-d-luffy.i18n.ts";

export const op17MonkeyDLuffy079: LeaderCard = {
  id: "OP17-079",
  canonicalId: "OP17-079",
  slug: "monkey-d-luffy/op17-079",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP17-079",
      artId: "OP17-079",
      setCode: "OP17",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-079_NMMHO3F.jpg",
      label: "Monkey.D.Luffy (079)",
    },
    {
      id: "OP17-079_p1",
      artId: "OP17-079_p2",
      setCode: "OP17",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-079_p2.jpg",
      label: "Monkey.D.Luffy (079) (Super Leader Alternate Art)",
    },
    {
      id: "OP17-079_p2",
      artId: "OP17-079_p1",
      setCode: "OP17",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-079_p1_DB0IOsB.jpg",
      label: "Monkey.D.Luffy (079) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "OP17",
  power: 5000,
  life: 5,
  traits: ["Straw Hat Crew The Four Emperors Elbaph"],
  attribute: "strike",
  effect:
    "All of your Characters with a cost of 12 or more gain [Blocker].(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 12,
                },
              ],
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op17MonkeyDLuffy079I18n,
};
