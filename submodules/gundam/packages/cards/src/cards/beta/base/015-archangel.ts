import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const betaArchangel015: BaseCard = {
  cardNumber: "ST04-015",
  name: "Archangel",
  type: "base",
  traits: ["earth alliance", "battleship"],
  id: "ST04-015_p2",
  externalId: "gundam:st04-015_p2",
  slug: "archangel-st04-015-p2",
  displayName: "Archangel",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "ST04-015_p2",
  printings: [
    {
      id: "ST04-015",
      collectorNumber: "ST04-015",
      cardNumber: "ST04-015",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04]",
        packageId: "616004",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-015.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-015.webp?260424",
      productName: "SEED Strike [ST04]",
    },
    {
      id: "ST04-015_p1",
      collectorNumber: "ST04-015_p1",
      cardNumber: "ST04-015",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04] Bonus Pack",
        packageId: "616004",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-015_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-015_p1.webp?260424",
      productName: "SEED Strike [ST04] Bonus Pack",
    },
    {
      id: "ST04-015_p2",
      collectorNumber: "ST04-015_p2",
      cardNumber: "ST04-015",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST04-015_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-015_p2.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "ST04-015_p3",
      collectorNumber: "ST04-015_p3",
      cardNumber: "ST04-015",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-015_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-015_p3.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
    {
      id: "ST04-015_p4",
      collectorNumber: "ST04-015_p4",
      cardNumber: "ST04-015",
      set: {
        code: "ST04",
        name: "Store Tournament Participant Pack 04",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-015_p4.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-015_p4.webp?260424",
      productName: "Store Tournament Participant Pack 04",
    },
    {
      id: "ST04-015_p5",
      collectorNumber: "ST04-015_p5",
      cardNumber: "ST04-015",
      set: {
        code: "ST04",
        name: "Store Tournament Winner Pack 04",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-015_p5.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-015_p5.webp?260424",
      productName: "Store Tournament Winner Pack 04",
    },
  ],
  selectedPrintingId: "ST04-015_p2",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST04-015_p2.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-015_p2.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Activate･Main】【Once per Turn】②：Choose 1 friendly Unit with &lt;Blocker&gt;. Set it as active. It can't attack during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [{ type: "oncePerTurn" }],
      },
      cost: {
        payResources: 2,
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "unit",
              hasKeyword: "Blocker",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "cantAttack",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              hasKeyword: "Blocker",
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】②：Choose 1 friendly Unit with <Blocker>. Set it as active. It can't attack during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
