import type { CharacterCard } from "@tcg/op-types";
import { prb02MonkeyDLuffyPrb02005005I18n } from "./prb02-005-monkey-d-luffy-prb02-005.i18n.ts";

export const prb02MonkeyDLuffyPrb02005005: CharacterCard = {
  id: "PRB02-005",
  canonicalId: "PRB02-005",
  slug: "monkey-d-luffy-prb02-005",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "PRB02-005",
      artId: "PRB02-005",
      setCode: "PRB02",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-005.jpg",
      label: "Monkey.D.Luffy - PRB02-005",
    },
    {
      id: "PRB02-005_p1",
      artId: "PRB02-005_p1",
      setCode: "PRB02",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-005_p1.jpg",
      label: "Monkey.D.Luffy - PRB02-005 (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "strike",
  effect:
    "[Your Turn] [On Play] If your Leader is multicolored and your opponent has 7 or less DON!! cards on their field, your opponent rests 1 of their active DON!! cards at the start of their next Main Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderMulticolored",
              },
              {
                condition: "donFieldCount",
                player: "opponent",
                comparison: "lte",
                value: 7,
              },
            ],
          },
        ],
        actions: [
          {
            action: "delayed",
            timing: "startOfOpponentNextMainPhase",
            actions: [
              {
                action: "rest",
                target: {
                  player: "opponent",
                  zones: ["costArea"],
                  count: {
                    amount: 1,
                  },
                  filters: [
                    {
                      filter: "state",
                      value: "active",
                    },
                  ],
                  chosenBy: "opponent",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: prb02MonkeyDLuffyPrb02005005I18n,
};
