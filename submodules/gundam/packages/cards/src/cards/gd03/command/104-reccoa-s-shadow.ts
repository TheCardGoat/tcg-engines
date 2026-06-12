import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03ReccoaSShadow104: CommandCard = {
  cardNumber: "GD03-104",
  name: "Reccoa's Shadow",
  type: "command",
  color: "blue",
  traits: ["titans", "jupitris"],
  id: "GD03-104",
  externalId: "gundam:gd03-104",
  slug: "reccoa-s-shadow-gd03-104",
  displayName: "Reccoa's Shadow",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-104",
  printings: [
    {
      id: "GD03-104",
      collectorNumber: "GD03-104",
      cardNumber: "GD03-104",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-104.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-104.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-104",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-104.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-104.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Reccoa Londe",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Rest it. If a friendly (Jupitris) Link Unit is in play, choose 1 to 2 enemy Units with 3 or less HP instead.\n【Pilot】[Reccoa Londe]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "jupitris",
            isLinkUnit: true,
          },
          thenDirectives: [
            {
              action: {
                action: "rest",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  attributeFilters: [
                    {
                      attribute: "hp",
                      comparison: "lte",
                      value: 3,
                    },
                  ],
                  count: { min: 1, max: 2 },
                },
              },
            },
          ],
          elseDirectives: [
            {
              action: {
                action: "rest",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  attributeFilters: [
                    {
                      attribute: "hp",
                      comparison: "lte",
                      value: 3,
                    },
                  ],
                  count: 1,
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Rest it. If a friendly (Jupitris) Link Unit is in play, choose 1 to 2 enemy Units with 3 or less HP instead. 【Pilot】[Reccoa Londe]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
