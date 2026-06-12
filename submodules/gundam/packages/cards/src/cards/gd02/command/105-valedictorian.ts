import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02Valedictorian105: CommandCard = {
  cardNumber: "GD02-105",
  name: "Valedictorian",
  type: "command",
  color: "green",
  traits: ["zeon", "newtype"],
  id: "GD02-105",
  externalId: "gundam:gd02-105",
  slug: "valedictorian-gd02-105",
  displayName: "Valedictorian",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-105",
  printings: [
    {
      id: "GD02-105",
      collectorNumber: "GD02-105",
      cardNumber: "GD02-105",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-105.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-105.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-105",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-105.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-105.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Xavier Olivette",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Action】Choose 1 of your Unit tokens. It can't receive battle damage from enemy Units during this battle.<br>【Pilot】[Xavier Olivette]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              isToken: true,
            },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 of your Unit tokens. It can't receive battle damage from enemy Units during this battle. 【Pilot】[Xavier Olivette]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
