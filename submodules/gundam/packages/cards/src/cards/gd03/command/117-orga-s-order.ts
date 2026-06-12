import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03OrgaSOrder117: CommandCard = {
  cardNumber: "GD03-117",
  name: "Orga's Order",
  type: "command",
  color: "purple",
  traits: [],
  id: "GD03-117",
  externalId: "gundam:gd03-117",
  slug: "orga-s-order-gd03-117",
  displayName: "Orga's Order",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-117",
  printings: [
    {
      id: "GD03-117",
      collectorNumber: "GD03-117",
      cardNumber: "GD03-117",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-117.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-117.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-117_p1",
      collectorNumber: "GD03-117_p1",
      cardNumber: "GD03-117",
      set: {
        code: "PC01A",
        name: "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam IRON-BLOODED ORPHANS-[PC01A]",
        packageId: "616701",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-117_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-117_p1.webp?260424",
      productName:
        "Premium Card Collection GUNDAM ASSEMBLE Set -Mobile Suit Gundam IRON-BLOODED ORPHANS-[PC01A]",
    },
  ],
  selectedPrintingId: "GD03-117",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-117.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-117.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  effect:
    "【Main】If 1 to 4 enemy Units are in play, deploy 1 [Graze Custom]((Tekkadan)･AP2･HP2) Unit token. If 5 or more are in play, deploy 1 [Gundam Barbatos 4th Form]((Tekkadan)･AP4･HP4) Unit token.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          condition: {
            type: "and",
            conditions: [
              {
                type: "unitCount",
                owner: "opponent",
                comparison: "gte",
                count: 1,
              },
              {
                type: "unitCount",
                owner: "opponent",
                comparison: "lte",
                count: 4,
              },
            ],
          },
          thenDirectives: [
            {
              action: {
                action: "deployToken",
                token: {
                  name: "Graze Custom",
                  traits: ["tekkadan"],
                  ap: 2,
                  hp: 2,
                  deployState: "active",
                },
              },
            },
          ],
        },
        {
          condition: {
            type: "unitCount",
            owner: "opponent",
            comparison: "gte",
            count: 5,
          },
          thenDirectives: [
            {
              action: {
                action: "deployToken",
                token: {
                  name: "Gundam Barbatos 4th Form",
                  traits: ["tekkadan"],
                  ap: 4,
                  hp: 4,
                  deployState: "active",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Main】If 1 to 4 enemy Units are in play, deploy 1 [Graze Custom]((Tekkadan)·AP2·HP2) Unit token. If 5 or more are in play, deploy 1 [Gundam Barbatos 4th Form]((Tekkadan)·AP4·HP4) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
export const pc01aOrgaSOrder117 = gd03OrgaSOrder117;
