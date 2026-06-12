import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02WhiteWolf106: CommandCard = {
  cardNumber: "GD02-106",
  name: "White Wolf",
  type: "command",
  color: "green",
  traits: ["earth federation"],
  id: "GD02-106",
  externalId: "gundam:gd02-106",
  slug: "white-wolf-gd02-106",
  displayName: "White Wolf",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-106",
  printings: [
    {
      id: "GD02-106",
      collectorNumber: "GD02-106",
      cardNumber: "GD02-106",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-106.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-106.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-106_p1",
      collectorNumber: "GD02-106_p1",
      cardNumber: "GD02-106",
      set: {
        code: "GD02",
        name: "Store Tournament Participant Pack 02",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-106_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-106_p1.webp?260424",
      productName: "Store Tournament Participant Pack 02",
    },
    {
      id: "GD02-106_p2",
      collectorNumber: "GD02-106_p2",
      cardNumber: "GD02-106",
      set: {
        code: "GD02",
        name: "Store Tournament Winner Pack 02",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-106_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-106_p2.webp?260424",
      productName: "Store Tournament Winner Pack 02",
    },
  ],
  selectedPrintingId: "GD02-106",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-106.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-106.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Woolf Enneacle",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Action】During this battle, your shield area cards can't receive damage from enemy Units that are Lv.3 or lower.<br>【Pilot】[Woolf Enneacle]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "preventDamageToZone",
            zone: "shieldArea",
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
            duration: "thisBattle",
          },
        },
      ],
      sourceText:
        "【Action】During this battle, your shield area cards can't receive damage from enemy Units that are Lv.3 or lower. 【Pilot】[Woolf Enneacle]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
