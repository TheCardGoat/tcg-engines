import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03BridgeCrew105: CommandCard = {
  cardNumber: "GD03-105",
  name: "Bridge Crew",
  type: "command",
  color: "green",
  traits: [],
  id: "GD03-105",
  externalId: "gundam:gd03-105",
  slug: "bridge-crew-gd03-105",
  displayName: "Bridge Crew",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-105",
  printings: [
    {
      id: "GD03-105",
      collectorNumber: "GD03-105",
      cardNumber: "GD03-105",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-105.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-105.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-105_p1",
      collectorNumber: "GD03-105_p1",
      cardNumber: "GD03-105",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-105_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-105_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-105",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-105.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-105.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Main】Choose 1 friendly Unit. During this turn, it may choose an active enemy Unit that has no Pilot paired with it as its attack target.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              count: 1,
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [{ attribute: "paired", comparison: "eq", value: false }],
            },
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 friendly Unit. During this turn, it may choose an active enemy Unit that has no Pilot paired with it as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
