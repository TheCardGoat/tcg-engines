import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st04TheMagicBulletOfDusk014: CommandCard = {
  cardNumber: "ST04-014",
  name: "The Magic Bullet of Dusk",
  type: "command",
  color: "red",
  traits: ["zaft", "coordinator"],
  id: "ST04-014",
  externalId: "gundam:st04-014",
  slug: "the-magic-bullet-of-dusk-st04-014",
  displayName: "The Magic Bullet of Dusk",
  set: { code: "ST04", name: "SEED Strike [ST04]", packageId: "616004" },
  printNumber: "ST04-014",
  printings: [
    {
      id: "ST04-014",
      collectorNumber: "ST04-014",
      cardNumber: "ST04-014",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04]",
        packageId: "616004",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-014.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-014.webp?260424",
      productName: "SEED Strike [ST04]",
    },
    {
      id: "ST04-014_p1",
      collectorNumber: "ST04-014_p1",
      cardNumber: "ST04-014",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04] Bonus Pack",
        packageId: "616004",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-014_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-014_p1.webp?260424",
      productName: "SEED Strike [ST04] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST04-014",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-014.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-014.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Miguel Ayman",
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 friendly Unit that is Lv.2 or lower. It gains &lt;First Strike&gt; during this turn.<br>\n(While this Unit is attacking, it deals damage before the enemy Unit.)<br>【Pilot】[Miguel Ayman]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 friendly Unit that is Lv.2 or lower. It gains <First Strike> during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.) 【Pilot】[Miguel Ayman]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
