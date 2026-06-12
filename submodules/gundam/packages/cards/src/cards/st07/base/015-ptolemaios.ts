import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const st07Ptolemaios015: BaseCard = {
  cardNumber: "ST07-015",
  name: "Ptolemaios",
  type: "base",
  traits: ["cb", "warship"],
  id: "ST07-015",
  externalId: "gundam:st07-015",
  slug: "ptolemaios-st07-015",
  displayName: "Ptolemaios",
  set: { code: "ST07", name: "Celestial Drive [ST07]", packageId: "616007" },
  printNumber: "ST07-015",
  printings: [
    {
      id: "ST07-015",
      collectorNumber: "ST07-015",
      cardNumber: "ST07-015",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07]",
        packageId: "616007",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-015.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-015.webp?260424",
      productName: "Celestial Drive [ST07]",
    },
    {
      id: "ST07-015_p1",
      collectorNumber: "ST07-015_p1",
      cardNumber: "ST07-015",
      set: {
        code: "ST07",
        name: "Celestial Drive [ST07] Bonus Pack",
        packageId: "616007",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-015_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-015_p1.webp?260424",
      productName: "Celestial Drive [ST07] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST07-015",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st07/ST07-015.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST07-015.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\nWhile a rested friendly (CB) Unit is in play, this Base can't receive damage from enemy Units that are Lv.3 or lower, other than Unit tokens.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "cb",
            state: "rested",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: { owner: "self" },
            unitFilter: {
              owner: "opponent",
              isToken: false,
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "While a rested friendly (CB) Unit is in play, this Base can't receive damage from enemy Units that are Lv.3 or lower, other than Unit tokens.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
