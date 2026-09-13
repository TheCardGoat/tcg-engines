import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd01UndergroundDesertBase126: BaseCard = {
  cardNumber: "GD01-126",
  name: "Underground Desert Base",
  type: "base",
  battlefieldZones: ["earth"],
  color: "green",
  traits: ["maganac corps", "stronghold"],
  id: "GD01-126",
  canonicalId: "GD01-126",
  externalIds: { bandai: "gundam:gd01-126" },
  slug: "underground-desert-base-gd01-126",
  displayName: "Underground Desert Base",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-126",
  printings: [
    {
      id: "GD01-126",
      artId: "GD01-126",
      setCode: "GD01",
      collectorNumber: "GD01-126",
      cardNumber: "GD01-126",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd01/GD01-126.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-126.webp?260715",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-126_p1",
      artId: "GD01-126_p1",
      setCode: "SC01",
      collectorNumber: "GD01-126_p1",
      cardNumber: "GD01-126",
      set: {
        code: "SC01",
        name: "Deck Build Box Freedom Ascension [SC01]",
        packageId: "616301",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd01/GD01-126_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-126_p1.webp?260715",
      productName: "Deck Build Box Freedom Ascension [SC01]",
    },
  ],
  reprints: ["GD01-126", "GD01-126_p1"],
  selectedPrintingId: "GD01-126",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd01/GD01-126.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-126.webp?260715",
  legality: "legal",
  level: 2,
  cost: 1,
  hp: 6,
  effect: "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>",
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
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
