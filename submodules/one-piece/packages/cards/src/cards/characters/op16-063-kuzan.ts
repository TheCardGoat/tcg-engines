import type { CharacterCard } from "@tcg/op-types";
import { op16Kuzan063I18n } from "./op16-063-kuzan.i18n.ts";

export const op16Kuzan063: CharacterCard = {
  id: "OP16-063",
  canonicalId: "OP16-063",
  slug: "kuzan/op16-063",
  name: "Kuzan",
  printings: [
    {
      id: "OP16-063",
      artId: "OP16-063",
      setCode: "OP16",
      collectorNumber: "063",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-063_0lnMo2V.jpg",
    },
    {
      id: "OP16-063_p1",
      artId: "OP16-063_p2",
      setCode: "OP16",
      collectorNumber: "063",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-063_p2_t7zoqfj.jpg",
      label: "Kuzan (Manga)",
    },
    {
      id: "OP16-063_p2",
      artId: "OP16-063_p1",
      setCode: "OP16",
      collectorNumber: "063",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-063_p1_oMZNYki.jpg",
      label: "Kuzan (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP16",
  cost: 7,
  power: 8000,
  traits: ["Navy Admiral"],
  attribute: "special",
  effect:
    "[On Play] Add up to 2 DON!! cards from your DON!! deck and rest them.\n[Activate: Main] [Once Per Turn] DON!! -1: Up to 1 of your opponent's Characters cannot activate [Blocker] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 2,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op16Kuzan063I18n,
};
