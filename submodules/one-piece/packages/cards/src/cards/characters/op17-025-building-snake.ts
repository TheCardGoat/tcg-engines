import type { CharacterCard } from "@tcg/op-types";
import { op17BuildingSnake025I18n } from "./op17-025-building-snake.i18n.ts";

export const op17BuildingSnake025: CharacterCard = {
  id: "OP17-025",
  canonicalId: "OP17-025",
  slug: "building-snake/op17-025",
  name: "Building Snake",
  printings: [
    {
      id: "OP17-025",
      artId: "OP17-025",
      setCode: "OP17",
      collectorNumber: "025",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-025_Yd4rZca.jpg",
    },
    {
      id: "OP17-025_p1",
      artId: "OP17-025",
      setCode: "OP17",
      collectorNumber: "025",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-025_n1mpBVd.jpg",
      label: "Building Snake (Pandaman Art)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP17",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "slash",
  effect:
    "[On K.O.] K.O. up to 1 of your opponent's rested Characters with a cost of 6 or less.\n[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to your [Shanks] Leader.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Shanks",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op17BuildingSnake025I18n,
};
