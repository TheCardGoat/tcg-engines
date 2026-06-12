import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04SochieHeim100: PilotCard = {
  cardNumber: "GD04-100",
  name: "Sochie Heim",
  type: "pilot",
  color: "white",
  traits: ["militia"],
  id: "GD04-100",
  externalId: "gundam:gd04-100",
  slug: "sochie-heim-gd04-100",
  displayName: "Sochie Heim",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-100",
  printings: [
    {
      id: "GD04-100",
      collectorNumber: "GD04-100",
      cardNumber: "GD04-100",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-100.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-100.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-100",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-100.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-100.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 0,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【Once per Turn】When you pay ① or more cost for one of your Units' effects, you may increase this Unit's AP during this turn by an amount equal to the cost paid.",
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
        timing: ["onUnitEffectCostPaid"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
            },
          },
        ],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "statModifierByEventPaidCost",
            stat: "ap",
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】When you pay ① or more cost for one of your Units' effects, you may increase this Unit's AP during this turn by an amount equal to the cost paid.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
