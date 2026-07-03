import type { EventCard } from "@tcg/op-types";
import { op13GumGumGatlingGun021I18n } from "./021-gum-gum-gatling-gun.i18n.ts";

export const op13GumGumGatlingGun021: EventCard = {
  id: "OP13-021",
  canonicalId: "OP13-021",
  slug: "gum-gum-gatling-gun",
  name: "Gum-Gum Gatling Gun",
  printings: [
    {
      id: "OP13-021",
      artId: "OP13-021",
      setCode: "OP13",
      collectorNumber: "021",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-021_coQV5ky.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  trigger: "Give up to 1 of your opponent's Characters 2000 power during this turn.",
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] Give up to 1 rested DON!! card to 1 of your [Monkey.D.Luffy] cards. Then, give up to 1 of your opponent's Characters 2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op13GumGumGatlingGun021I18n,
};
