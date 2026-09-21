import type { EventCard } from "@tcg/op-types";
import { op17DonTYouKnowThatEvenInTheCruelWorldOfPiratesThereSStillACodeOfHonor115I18n } from "./op17-115-don-t-you-know-that-even-in-the-cruel-world-of-pirates-there-s-still-a-code-of-honor.i18n.ts";

export const op17DonTYouKnowThatEvenInTheCruelWorldOfPiratesThereSStillACodeOfHonor115: EventCard =
  {
    id: "OP17-115",
    canonicalId: "OP17-115",
    slug: "don-t-you-know-that-even-in-the-cruel-world-of-pirates-there-s-still-a-code-of-honor/op17-115",
    name: "Don't you know that even in the cruel world of pirates there's still a code of honor?!!",
    printings: [
      {
        id: "OP17-115",
        artId: "OP17-115",
        setCode: "OP17",
        collectorNumber: "115",
        rarity: "R",
        imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-115_ODSETVl.jpg",
      },
    ],
    cardType: "event",
    color: ["yellow"],
    rarity: "R",
    setId: "OP17",
    cost: 1,
    traits: ["The Four Emperors Big Mom Pirates"],
    effect:
      "[Main] Your [Charlotte Linlin] Leader gains [Unblockable] during this turn.\n[Counter] Up to 1 of your [Charlotte Linlin] gains +4000 power during this battle.",
    effects: {
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["leader"],
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "name",
                    value: "Charlotte Linlin",
                  },
                ],
              },
              keyword: "unblockable",
              duration: "thisTurn",
            },
          ],
        },
        {
          trigger: "counter",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "name",
                    value: "Charlotte Linlin",
                  },
                ],
              },
              value: 4000,
              duration: "thisBattle",
            },
          ],
        },
      ],
    },
    i18n: op17DonTYouKnowThatEvenInTheCruelWorldOfPiratesThereSStillACodeOfHonor115I18n,
  };
