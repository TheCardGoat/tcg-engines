import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const betaHawkOfEndymion013: CommandCard = {
  cardNumber: "ST04-013",
  name: "Hawk of Endymion",
  type: "command",
  color: "white",
  traits: ["earth alliance"],
  id: "ST04-013_p2",
  externalId: "gundam:st04-013_p2",
  slug: "hawk-of-endymion-st04-013-p2",
  displayName: "Hawk of Endymion",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "ST04-013_p2",
  printings: [
    {
      id: "ST04-013",
      collectorNumber: "ST04-013",
      cardNumber: "ST04-013",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04]",
        packageId: "616004",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-013.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-013.webp?260424",
      productName: "SEED Strike [ST04]",
    },
    {
      id: "ST04-013_p1",
      collectorNumber: "ST04-013_p1",
      cardNumber: "ST04-013",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04] Bonus Pack",
        packageId: "616004",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-013_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-013_p1.webp?260424",
      productName: "SEED Strike [ST04] Bonus Pack",
    },
    {
      id: "ST04-013_p2",
      collectorNumber: "ST04-013_p2",
      cardNumber: "ST04-013",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST04-013_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-013_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "ST04-013_p2",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST04-013_p2.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-013_p2.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Mu La Flaga",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.<br>【Pilot】[Mu La Flaga]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
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
      sourceText:
        "【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand. 【Pilot】[Mu La Flaga]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
