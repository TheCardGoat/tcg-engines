import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03TheO002: UnitCard = {
  cardNumber: "GD03-002",
  name: "The-O",
  type: "unit",
  color: "blue",
  traits: ["titans", "jupitris"],
  id: "GD03-002",
  externalId: "gundam:gd03-002",
  slug: "the-o-gd03-002",
  displayName: "The-O",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-002",
  printings: [
    {
      id: "GD03-002",
      collectorNumber: "GD03-002",
      cardNumber: "GD03-002",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-002.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-002.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-002_p1",
      collectorNumber: "GD03-002_p1",
      cardNumber: "GD03-002",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-002_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-002_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-002",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-002.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-002.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Paptimus Scirocco]",
  effect:
    "<Repair 3> (At the end of your turn, this Unit recovers the specified number of HP.)\n【During Pair】When one of your other Units with <Repair> attacks, choose 1 enemy Unit whose Lv. is equal to or lower than that Unit. Rest it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          { type: "duringPair" },
          { type: "eventPlayerIsSelf" },
          {
            type: "eventSourceMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              hasKeyword: "Repair",
              excludeSource: true,
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: { ref: "eventSource", stat: "level" },
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Pair】When one of your other Units with <Repair> attacks, choose 1 enemy Unit whose Lv. is equal to or lower than that Unit. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Repair", value: 3 }],
  rarity: "legendRare",
};
