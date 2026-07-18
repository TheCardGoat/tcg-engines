import type { LeaderCard } from "@tcg/op-types";
import { op11Koby001I18n } from "./001-koby.i18n.ts";

export const op11Koby001: LeaderCard = {
  id: "OP11-001",
  canonicalId: "OP11-001",
  slug: "koby/op11-001",
  name: "Koby",
  printings: [
    {
      id: "OP11-001",
      artId: "OP11-001",
      setCode: "OP11",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-001.jpg",
    },
    {
      id: "OP11-001_p1",
      artId: "OP11-001_p1",
      setCode: "OP11",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-001_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["red", "black"],
  rarity: "L",
  setId: "OP11",
  power: 5000,
  life: 4,
  traits: ["Navy SWORD"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-001_p1.jpg",
      imageId: "OP11-001_p1",
    },
  ],
  effect:
    'Your "SWORD" type Characters can attack Characters on the turn in which they are played.\n[Once Per Turn] If your "Navy" type Character with 7000 base power or less would be removed from the field by your opponent\'s effect, you may place 3 cards from your trash at the bottom of your deck in any order instead.',
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: "all" },
              filters: [{ filter: "trait", value: "SWORD", match: "includes" }],
            },
            keyword: "rushCharacter",
            duration: "permanent",
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        eventFilter: {
          player: "self",
          causedBy: "opponent",
          filters: [
            { filter: "trait", value: "Navy", match: "includes" },
            { filter: "basePower", comparison: "lte", value: 7000 },
          ],
        },
        replacementAction: {
          action: "returnToDeck",
          target: {
            player: "self",
            zones: ["trash"],
            count: {
              amount: 3,
            },
          },
          position: "bottom",
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11Koby001I18n,
};
