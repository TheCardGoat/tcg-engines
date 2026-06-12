import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st08LaneAim011: PilotCard = {
  cardNumber: "ST08-011",
  name: "Lane Aim",
  type: "pilot",
  color: "blue",
  traits: ["earth federation"],
  id: "ST08-011",
  externalId: "gundam:st08-011",
  slug: "lane-aim-st08-011",
  displayName: "Lane Aim",
  set: { code: "ST08", name: "Flash of Radiance [ST08]", packageId: "616008" },
  printNumber: "ST08-011",
  printings: [
    {
      id: "ST08-011",
      collectorNumber: "ST08-011",
      cardNumber: "ST08-011",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08]",
        packageId: "616008",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-011.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-011.webp?260424",
      productName: "Flash of Radiance [ST08]",
    },
    {
      id: "ST08-011_p1",
      collectorNumber: "ST08-011_p1",
      cardNumber: "ST08-011",
      set: {
        code: "ST08",
        name: "Flash of Radiance [ST08] Bonus Pack",
        packageId: "616008",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-011_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-011_p1.webp?260424",
      productName: "Flash of Radiance [ST08] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST08-011",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st08/ST08-011.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST08-011.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\nWhen you draw with an effect, if this is a blue Unit, it gains <High-Maneuver> during this turn.\n\r\n(This Unit can' t be blocked.)",
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
        timing: ["onDrawByEffect"],
        conditions: [{ type: "eventPlayerIsSelf" }, { type: "linkedUnitHasColor", color: "blue" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "When you draw with an effect, if this is a blue Unit, it gains <High-Maneuver> during this turn. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
