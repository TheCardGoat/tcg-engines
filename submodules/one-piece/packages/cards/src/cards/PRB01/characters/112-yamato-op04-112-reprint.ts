import type { CharacterCard } from "@tcg/op-types";
import { prb01YamatoOp04112Reprint112I18n } from "./112-yamato-op04-112-reprint.i18n.ts";

export const prb01YamatoOp04112Reprint112: CharacterCard = {
  id: "OP04-112",
  canonicalId: "OP04-112",
  slug: "yamato-op04-112-reprint",
  name: "Yamato (OP04-112) (Reprint)",
  printings: [
    {
      id: "OP04-112",
      artId: "OP04-112",
      setCode: "PRB01",
      collectorNumber: "112",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-112_r1.jpg",
    },
    {
      id: "OP04-112_p3",
      artId: "OP04-112_p3",
      setCode: "PRB01",
      collectorNumber: "112",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-112_p3.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "PRB01",
  cost: 9,
  power: 9000,
  traits: ["Land of Wano"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-112_p3.jpg",
      imageId: "OP04-112_p3",
    },
  ],
  effect:
    "[On Play] K.O. up to 1 of your opponent's Characters with a cost equal to or less than the total of your and your opponent's Life cards. Then, if you have 1 or less Life cards, add up to 1 card from the top of your deck to the top of your Life cards.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "totalLifeCount",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb01YamatoOp04112Reprint112I18n,
};
