import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st04AthrunZala011: PilotCard = {
  cardNumber: "ST04-011",
  name: "Athrun Zala",
  type: "pilot",
  color: "red",
  traits: ["zaft", "coordinator"],
  id: "ST04-011",
  externalId: "gundam:st04-011",
  slug: "athrun-zala-st04-011",
  displayName: "Athrun Zala",
  set: { code: "ST04", name: "SEED Strike [ST04]", packageId: "616004" },
  printNumber: "ST04-011",
  printings: [
    {
      id: "ST04-011",
      collectorNumber: "ST04-011",
      cardNumber: "ST04-011",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04]",
        packageId: "616004",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-011.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-011.webp?260424",
      productName: "SEED Strike [ST04]",
    },
    {
      id: "ST04-011_p1",
      collectorNumber: "ST04-011_p1",
      cardNumber: "ST04-011",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04] Bonus Pack",
        packageId: "616004",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-011_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-011_p1.webp?260424",
      productName: "SEED Strike [ST04] Bonus Pack",
    },
    {
      id: "ST04-011_p2",
      collectorNumber: "ST04-011_p2",
      cardNumber: "ST04-011",
      set: {
        code: "ST04",
        name: "Store Tournament Participant Pack 01",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-011_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-011_p2.webp?260424",
      productName: "Store Tournament Participant Pack 01",
    },
    {
      id: "ST04-011_p3",
      collectorNumber: "ST04-011_p3",
      cardNumber: "ST04-011",
      set: {
        code: "ST04",
        name: "Store Tournament Winner Pack 01",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-011_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-011_p3.webp?260424",
      productName: "Store Tournament Winner Pack 01",
    },
    {
      id: "ST04-011_p4",
      collectorNumber: "ST04-011_p4",
      cardNumber: "ST04-011",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-011_p4.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-011_p4.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "ST04-011",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st04/ST04-011.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-011.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.<br>【When Linked】During this turn, this Unit may choose an active enemy Unit that is Lv.5 or lower as its attack target.<br>",
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
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "self",
              cardType: "unit",
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【When Linked】During this turn, this Unit may choose an active enemy Unit that is Lv.5 or lower as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
