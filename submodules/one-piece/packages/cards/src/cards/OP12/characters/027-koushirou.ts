import type { CharacterCard } from "@tcg/op-types";
import { op12Koushirou027I18n } from "./027-koushirou.i18n.ts";

export const op12Koushirou027: CharacterCard = {
  id: "OP12-027",
  canonicalId: "OP12-027",
  slug: "koushirou/op12-027",
  name: "Koushirou",
  printings: [
    {
      id: "OP12-027",
      artId: "OP12-027",
      setCode: "OP12",
      collectorNumber: "027",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-027_A8N5PiE.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP12",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["East Blue Frost Moon Village"],
  attribute: "slash",
  effect:
    "If your (Slash) attribute Character with a cost of 5 or less other than this Character would be K.O.'d by your opponent's effect, you may rest this Character instead.\n[Blocker]",
  effects: {
    keywords: ["blocker"],
    replacementEffects: [
      {
        replacedEvent: "ko",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          filters: [
            { filter: "attribute", value: "slash" },
            { filter: "excludeSelf" },
            { filter: "cost", comparison: "lte", value: 5 },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1 },
            self: true,
          },
        },
      },
    ],
  },
  i18n: op12Koushirou027I18n,
};
