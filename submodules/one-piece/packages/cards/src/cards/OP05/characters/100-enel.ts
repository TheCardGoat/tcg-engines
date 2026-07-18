import type { CharacterCard } from "@tcg/op-types";
import { op05Enel100I18n } from "./100-enel.i18n.ts";

export const op05Enel100: CharacterCard = {
  id: "OP05-100",
  canonicalId: "OP05-100",
  slug: "enel/op05-100",
  name: "Enel",
  printings: [
    {
      id: "OP05-100",
      artId: "OP05-100",
      setCode: "OP05",
      collectorNumber: "100",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-100.jpg",
    },
    {
      id: "OP05-100_p2",
      artId: "OP05-100_p2",
      setCode: "OP05",
      collectorNumber: "100",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-100_p2.jpg",
    },
    {
      id: "OP05-100_p1",
      artId: "OP05-100_p1",
      setCode: "OP05",
      collectorNumber: "100",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-100_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP05",
  cost: 7,
  power: 7000,
  traits: ["Sky Island"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-100_p2.jpg",
      imageId: "OP05-100_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-100_p1.jpg",
      imageId: "OP05-100_p1",
    },
  ],
  effect:
    "[Rush] [Once Per Turn] If this Character would leave the field, you may trash 1 card from the top of your Life cards instead. If there is a [Monkey.D.Luffy] Character, this effect is negated.",
  effects: {
    keywords: ["rush"],
    replacementEffects: [
      {
        replacedEvent: "leaveField",
        eventFilter: { targetSelf: true },
        replacementAction: {
          action: "removeFromLife",
          player: "self",
          count: {
            amount: 1,
          },
          destination: "trash",
        },
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "notHasCard",
                player: "self",
                zone: "character",
                filters: [{ filter: "name", value: "Monkey.D.Luffy" }],
              },
              {
                condition: "notHasCard",
                player: "opponent",
                zone: "character",
                filters: [{ filter: "name", value: "Monkey.D.Luffy" }],
              },
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05Enel100I18n,
};
