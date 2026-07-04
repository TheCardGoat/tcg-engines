import type { CharacterCard } from "@tcg/op-types";
import { op09MonkeyDLuffyWantedPoster119I18n } from "./119-monkey-d-luffy-wanted-poster.i18n.ts";

export const op09MonkeyDLuffyWantedPoster119: CharacterCard = {
  id: "OP05-119",
  canonicalId: "OP05-119",
  slug: "monkey-d-luffy-wanted-poster/op05-119",
  name: "Monkey.D.Luffy (Wanted Poster)",
  printings: [
    {
      id: "OP05-119",
      artId: "OP05-119",
      setCode: "OP09",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-119_p6.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "OP09",
  cost: 10,
  power: 12000,
  traits: ["Straw Hat Crew The Four Emperors"],
  attribute: "strike",
  effect:
    "[On Play] DON!! 10: Place all of your Characters except this Character at the bottom of your deck in any order. Then, take an extra turn after this one.\n[Activate: Main] [Once Per Turn] You may rest 1 of your DON!! cards: Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 10,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "excludeName",
                  value: "__self__",
                },
              ],
              self: false,
            },
            position: "bottom",
          },
          {
            action: "extraTurn",
          },
        ],
      },
      {
        trigger: "activateMain",
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
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op09MonkeyDLuffyWantedPoster119I18n,
};
