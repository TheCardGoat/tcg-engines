import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st06RuthlessTactics011: CommandCard = {
  cardNumber: "ST06-011",
  name: "Ruthless Tactics",
  type: "command",
  color: "red",
  traits: ["clan"],
  id: "ST06-011",
  externalId: "gundam:st06-011",
  slug: "ruthless-tactics-st06-011",
  displayName: "Ruthless Tactics",
  set: { code: "ST06", name: "Clan Unity [ST06]", packageId: "616006" },
  printNumber: "ST06-011",
  printings: [
    {
      id: "ST06-011",
      collectorNumber: "ST06-011",
      cardNumber: "ST06-011",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06]",
        packageId: "616006",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-011.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-011.webp?260424",
      productName: "Clan Unity [ST06]",
    },
    {
      id: "ST06-011_p1",
      collectorNumber: "ST06-011_p1",
      cardNumber: "ST06-011",
      set: {
        code: "ST06",
        name: "Clan Unity [ST06] Bonus Pack",
        packageId: "616006",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-011_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-011_p1.webp?260424",
      productName: "Clan Unity [ST06] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST06-011",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st06/ST06-011.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST06-011.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Gaia (GQ)",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】Choose 1 to 2 friendly (Clan) Units. They get AP+2 during this turn.<br>【Pilot】[Gaia (GQ)]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "clan",
                },
              ],
              count: {
                min: 1,
                max: 2,
              },
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 to 2 friendly (Clan) Units. They get AP+2 during this turn. 【Pilot】[Gaia (GQ)]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
