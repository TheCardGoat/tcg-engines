import type { CharacterCard } from "@tcg/op-types";
import { op15TheRiskyBrothers093I18n } from "./op15-093-the-risky-brothers.i18n.ts";

export const op15TheRiskyBrothers093: CharacterCard = {
  id: "OP15-093",
  canonicalId: "OP15-093",
  slug: "the-risky-brothers/op15-093",
  name: "The Risky Brothers",
  printings: [
    {
      id: "OP15-093",
      artId: "OP15-093",
      setCode: "OP15",
      collectorNumber: "093",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-093_XWHW3gZ.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP15",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Rolling Pirates"],
  attribute: "slash",
  effect:
    '[Activate: Main] You may trash this Character: If you have 15 or more cards in your trash, up to 1 of your [Monkey.D.Luffy] Characters gains [Rush: Character] and the "Slash" attribute during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        optional: true,
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 15,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [{ filter: "name", value: "Monkey.D.Luffy" }],
            },
            keyword: "rushCharacter",
            duration: "thisTurn",
          },
          {
            action: "grantAttribute",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [{ filter: "name", value: "Monkey.D.Luffy" }],
            },
            value: "slash",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op15TheRiskyBrothers093I18n,
};
