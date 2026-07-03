import type { EventCard } from "@tcg/op-types";
import { op12LuffyIsTheManWhoWillBeKingOfThePirates079I18n } from "./079-luffy-is-the-man-who-will-be-king-of-the-pirates.i18n.ts";

export const op12LuffyIsTheManWhoWillBeKingOfThePirates079: EventCard = {
  id: "OP12-079",
  canonicalId: "OP12-079",
  slug: "luffy-is-the-man-who-will-be-king-of-the-pirates",
  name: "Luffy Is the Man Who Will Be King of the Pirates!!!",
  printings: [
    {
      id: "OP12-079",
      artId: "OP12-079",
      setCode: "OP12",
      collectorNumber: "079",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-079_MKMLuPv.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] If your Leader is [Sanji], look at 3 cards from the top of your deck and add up to 1 card to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Sanji",
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op12LuffyIsTheManWhoWillBeKingOfThePirates079I18n,
};
