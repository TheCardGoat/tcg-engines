import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const st06KanebanCoLtd015: BaseCard = {
  cardNumber: "ST06-015",
  name: "Kaneban Co., Ltd.",
  type: "base",
  traits: ["clan", "stronghold"],
  id: "ST06-015",
  externalId: "gundam:st06-015",
  slug: "kaneban-co-ltd-st06-015",
  displayName: "Kaneban Co., Ltd.",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST06-015",
  printings: [
    {
      id: "ST06-015",
      collectorNumber: "ST06-015",
      cardNumber: "ST06-015",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-015.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-015.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST06-015_p1",
      collectorNumber: "ST06-015_p1",
      cardNumber: "ST06-015",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-015_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-015_p1.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST06-015",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-015.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-015.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Once per Turn】When a friendly (Clan) Unit links, it gains &lt;Breach 3&gt; during this turn.<br>\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)<br>",
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
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "clan",
          },
        ],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 3,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              isLinkUnit: true,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "clan" }],
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】When a friendly (Clan) Unit links, it gains <Breach 3> during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
