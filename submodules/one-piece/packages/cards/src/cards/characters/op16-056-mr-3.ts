import type { CharacterCard } from "@tcg/op-types";
import { op16Mr3056I18n } from "./op16-056-mr-3.i18n.ts";

export const op16Mr3056: CharacterCard = {
  id: "OP16-056",
  canonicalId: "OP16-056",
  slug: "mr-3/op16-056",
  name: "Mr.3",
  printings: [
    {
      id: "OP16-056",
      artId: "OP16-056",
      setCode: "OP16",
      collectorNumber: "056",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-056_eJ8kOw4.jpg",
      label: "Mr.3(Galdino) (056)",
    },
    {
      id: "OP16-056_p1",
      artId: "OP16-056_p1",
      setCode: "OP16",
      collectorNumber: "056",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-056_p1_lCCqPWh.jpg",
      label: "Mr.3(Galdino) (056) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP16",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Impel Down Former Baroque Works"],
  attribute: "special",
  effect:
    "[Activate: Main] You may trash this Character: Draw 2 cards, and up to 1 of your opponent's Characters with a cost of 9 or less cannot attack until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 9,
                },
              ],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op16Mr3056I18n,
};
