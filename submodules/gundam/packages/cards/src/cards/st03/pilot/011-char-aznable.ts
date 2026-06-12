import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st03CharAznable011: PilotCard = {
  cardNumber: "ST03-011",
  name: "Char Aznable",
  type: "pilot",
  color: "green",
  traits: ["zeon", "newtype"],
  id: "ST03-011",
  externalId: "gundam:st03-011",
  slug: "char-aznable-st03-011",
  displayName: "Char Aznable",
  set: { code: "ST03", name: "Zeon's Rush [ST03]", packageId: "616003" },
  printNumber: "ST03-011",
  printings: [
    {
      id: "ST03-011",
      collectorNumber: "ST03-011",
      cardNumber: "ST03-011",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03]",
        packageId: "616003",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-011.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-011.webp?260424",
      productName: "Zeon's Rush [ST03]",
    },
    {
      id: "ST03-011_p1",
      collectorNumber: "ST03-011_p1",
      cardNumber: "ST03-011",
      set: {
        code: "ST03",
        name: "Zeon's Rush [ST03] Bonus Pack",
        packageId: "616003",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-011_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-011_p1.webp?260424",
      productName: "Zeon's Rush [ST03] Bonus Pack",
    },
    {
      id: "ST03-011_p2",
      collectorNumber: "ST03-011_p2",
      cardNumber: "ST03-011",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST03-011_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-011_p2.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "ST03-011_p3",
      collectorNumber: "ST03-011_p3",
      cardNumber: "ST03-011",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/ST03-011_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-011_p3.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "ST03-011",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st03/ST03-011.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-011.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【Attack】During this turn, this Unit gets AP+1 and, if it is a Link Unit, it gains &lt;High-Maneuver&gt;.<br>\n(This Unit can't be blocked.)<br>",
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
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
              isLinkUnit: true,
            },
          },
        },
      ],
      sourceText:
        "【Attack】During this turn, this Unit gets AP+1 and, if it is a Link Unit, it gains <High-Maneuver>. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
