import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st02PeacefulTimbre013: CommandCard = {
  cardNumber: "ST02-013",
  name: "Peaceful Timbre",
  type: "command",
  color: "green",
  traits: ["operation meteor"],
  id: "ST02-013",
  externalId: "gundam:st02-013",
  slug: "peaceful-timbre-st02-013",
  displayName: "Peaceful Timbre",
  set: { code: "ST02", name: "Wings of Advance [ST02]", packageId: "616002" },
  printNumber: "ST02-013",
  printings: [
    {
      id: "ST02-013",
      collectorNumber: "ST02-013",
      cardNumber: "ST02-013",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02]",
        packageId: "616002",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-013.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-013.webp?260424",
      productName: "Wings of Advance [ST02]",
    },
    {
      id: "ST02-013_p1",
      collectorNumber: "ST02-013_p1",
      cardNumber: "ST02-013",
      set: {
        code: "ST02",
        name: "Wings of Advance [ST02] Bonus Pack",
        packageId: "616002",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-013_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-013_p1.webp?260424",
      productName: "Wings of Advance [ST02] Bonus Pack",
    },
    {
      id: "ST02-013_p2",
      collectorNumber: "ST02-013_p2",
      cardNumber: "ST02-013",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST02-013_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-013_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "ST02-013",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st02/ST02-013.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-013.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  pilotName: "Quatre Raberba Winner",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Action】During this battle, your shield area cards can't receive damage from enemy Units that are Lv.4 or lower.<br>【Pilot】[Quatre Raberba Winner]<br>",
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
                  value: 4,
                },
              ],
            },
            duration: "thisBattle",
          },
        },
      ],
      sourceText:
        "【Action】During this battle, your shield area cards can't receive damage from enemy Units that are Lv.4 or lower. 【Pilot】[Quatre Raberba Winner]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
