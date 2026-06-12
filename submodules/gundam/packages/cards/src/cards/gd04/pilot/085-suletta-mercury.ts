import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04SulettaMercury085: PilotCard = {
  cardNumber: "GD04-085",
  name: "Suletta Mercury",
  type: "pilot",
  color: "green",
  traits: ["academy"],
  id: "GD04-085",
  externalId: "gundam:gd04-085",
  slug: "suletta-mercury-gd04-085",
  displayName: "Suletta Mercury",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-085",
  printings: [
    {
      id: "GD04-085",
      collectorNumber: "GD04-085",
      cardNumber: "GD04-085",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-085.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-085.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-085_p1",
      collectorNumber: "GD04-085_p1",
      cardNumber: "GD04-085",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-085_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-085_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-085_p2",
      collectorNumber: "GD04-085_p2",
      cardNumber: "GD04-085",
      set: {
        code: "GD04",
        name: "Booster Pack Phantom Aria [GD04] Release Event Commemorative Items for Participants",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-085_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-085_p2.webp?260424",
      productName:
        "Booster Pack Phantom Aria [GD04] Release Event Commemorative Items for Participants",
    },
  ],
  selectedPrintingId: "GD04-085",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-085.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-085.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  apBonus: 2,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】【Once per Turn】When you play and activate an (Academy) Command card using an EX Resource, if you have no remaining EX Resources, place 1 rested EX Resource.",
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
        timing: ["onCommandEffectActivated"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [
          { type: "duringLink" },
          { type: "eventPlayerIsSelf" },
          { type: "eventPaidExResources", comparison: "gte", count: 1 },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "command",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "academy" }],
            },
          },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "resourceArea",
            cardType: "resource",
            hasName: "EX Resource",
            comparison: "eq",
            count: 0,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "placeExResource",
            state: "rested",
          },
        },
      ],
      sourceText:
        "【During Link】【Once per Turn】When you play and activate an (Academy) Command card using an EX Resource, if you have no remaining EX Resources, place 1 rested EX Resource.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
