import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03ZakuFz020: UnitCard = {
  cardNumber: "GD03-020",
  name: "Zaku Ⅱ FZ",
  type: "unit",
  color: "green",
  traits: ["zeon", "cyclops team"],
  id: "GD03-020",
  externalId: "gundam:gd03-020",
  slug: "zaku-fz-gd03-020",
  displayName: "Zaku Ⅱ FZ",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-020",
  printings: [
    {
      id: "GD03-020",
      collectorNumber: "GD03-020",
      cardNumber: "GD03-020",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-020.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-020.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-020_p1",
      collectorNumber: "GD03-020_p1",
      cardNumber: "GD03-020",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-020_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-020_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-020_p3",
      collectorNumber: "GD03-020_p3",
      cardNumber: "GD03-020",
      set: {
        code: "GD03",
        name: "Booster Pack Steel Requiem [GD03] Release Event",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-020_p3.webp?260424",
      productName: "Booster Pack Steel Requiem [GD03] Release Event",
    },
  ],
  selectedPrintingId: "GD03-020",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-020.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-020.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 1,
  hp: 2,
  linkCondition: "[Bernard Wiseman]",
  effect:
    "【When Paired】If there are 4 or more (Cyclops Team) cards in your trash, deploy 2 rested [Ad Balloon]((Civilian)･AP0･HP1･This Unit can't be set as active or paired with a Pilot) Unit tokens.\nWhile you have a Unit with \"Ad Balloon\" in its card name in play, this Unit can't receive enemy battle damage.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 4,
            hasTrait: "cyclops team",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "Ad Balloon",
              traits: ["civilian"],
              ap: 0,
              hp: 1,
              deployState: "rested",
            },
            count: 2,
          },
        },
      ],
      sourceText:
        "【When Paired】If there are 4 or more (Cyclops Team) cards in your trash, deploy 2 rested [Ad Balloon]((Civilian)·AP0·HP1·This Unit can't be set as active or paired with a Pilot) Unit tokens.",
    },
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "unit",
            comparison: "gte",
            count: 1,
            hasName: "Ad Balloon",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: {
              owner: "self",
            },
            damageType: "battle",
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        'While you have a Unit with "Ad Balloon" in its card name in play, this Unit can\'t receive enemy battle damage.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
