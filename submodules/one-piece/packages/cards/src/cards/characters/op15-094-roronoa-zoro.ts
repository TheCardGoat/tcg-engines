import type { CharacterCard } from "@tcg/op-types";
import { op15RoronoaZoro094I18n } from "./op15-094-roronoa-zoro.i18n.ts";

export const op15RoronoaZoro094: CharacterCard = {
  id: "OP15-094",
  canonicalId: "OP15-094",
  slug: "roronoa-zoro/op15-094",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP15-094",
      artId: "OP15-094",
      setCode: "OP15",
      collectorNumber: "094",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-094_AGSmVMl.jpg",
      label: "Roronoa Zoro (OP15-094)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP15",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "If your {Straw Hat Crew} type Character other than this Character would be removed from the field by your opponent's effect, you may trash this Character instead.\n[Blocker]",
  effects: {
    keywords: ["blocker"],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "trait",
              value: "Straw Hat Crew",
              match: "includes",
            },
            {
              filter: "excludeSelf",
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "trashThisCard",
        },
      },
    ],
  },
  i18n: op15RoronoaZoro094I18n,
};
