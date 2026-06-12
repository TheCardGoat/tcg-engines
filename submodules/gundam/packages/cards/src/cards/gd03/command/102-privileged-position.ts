import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03PrivilegedPosition102: CommandCard = {
  cardNumber: "GD03-102",
  name: "Privileged Position",
  type: "command",
  color: "blue",
  traits: [],
  id: "GD03-102",
  externalId: "gundam:gd03-102",
  slug: "privileged-position-gd03-102",
  displayName: "Privileged Position",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-102",
  printings: [
    {
      id: "GD03-102",
      collectorNumber: "GD03-102",
      cardNumber: "GD03-102",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-102.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-102.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-102",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-102.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-102.webp?260424",
  legality: "legal",
  level: 6,
  cost: 2,
  effect:
    "【Burst】Draw 1.\n【Action】Choose 1 of your (Titans) Link Units battling an enemy Unit. Set it as active.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Burst】Draw 1.",
    },
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "titans",
                },
              ],
              isLinkUnit: true,
              isBattling: {
                opponentMatches: {
                  owner: "opponent",
                  cardType: "unit",
                },
              },
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 of your (Titans) Link Units battling an enemy Unit. Set it as active.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
