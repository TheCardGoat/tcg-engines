import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03Gfred035: UnitCard = {
  cardNumber: "GD03-035",
  name: "GFreD",
  type: "unit",
  color: "red",
  traits: ["zeon"],
  id: "GD03-035",
  externalId: "gundam:gd03-035",
  slug: "gfred-gd03-035",
  displayName: "GFreD",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-035",
  printings: [
    {
      id: "GD03-035",
      collectorNumber: "GD03-035",
      cardNumber: "GD03-035",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-035.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-035.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-035_p1",
      collectorNumber: "GD03-035_p1",
      cardNumber: "GD03-035",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-035_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-035_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-035_p2",
      collectorNumber: "GD03-035_p2",
      cardNumber: "GD03-035",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-035_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-035_p2.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-035",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-035.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-035.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 4,
  hp: 5,
  linkCondition: "[Nyaan]",
  effect:
    "【Activate･Main】【Once per Turn】①, exile 1 Pilot card from your trash: Deal 1 damage to all enemy Units.\n【When Linked】During this turn, this Unit may choose an active enemy Unit with AP equal to or less than this Unit as its attack target.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        payResources: 1,
        exileFromTrash: {
          owner: "friendly",
          cardType: "pilot",
          zone: "trash",
          count: 1,
        },
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: "all",
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】①, exile 1 Pilot card from your trash: Deal 1 damage to all enemy Units.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "self",
              cardType: "unit",
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                { attribute: "ap", comparison: "lte", value: { ref: "source", stat: "ap" } },
              ],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【When Linked】During this turn, this Unit may choose an active enemy Unit with AP equal to or less than this Unit as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
