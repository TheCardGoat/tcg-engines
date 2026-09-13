import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GundamDeathscythe025: UnitCard = {
  cardNumber: "GD01-025",
  name: "Gundam Deathscythe",
  type: "unit",
  battlefieldZones: ["earth"],
  color: "green",
  traits: ["operation meteor"],
  id: "GD01-025",
  canonicalId: "GD01-025",
  externalIds: { bandai: "gundam:gd01-025" },
  slug: "gundam-deathscythe-gd01-025",
  displayName: "Gundam Deathscythe",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-025",
  printings: [
    {
      id: "GD01-025",
      artId: "GD01-025",
      setCode: "GD01",
      collectorNumber: "GD01-025",
      cardNumber: "GD01-025",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd01/GD01-025.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-025.webp?260715",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-025_p1",
      artId: "GD01-025_p1",
      setCode: "GD01",
      collectorNumber: "GD01-025_p1",
      cardNumber: "GD01-025",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd01/GD01-025_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-025_p1.webp?260715",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-025_p2",
      artId: "GD01-025_p2",
      setCode: "SC01",
      collectorNumber: "GD01-025_p2",
      cardNumber: "GD01-025",
      set: {
        code: "SC01",
        name: "Deck Build Box Freedom Ascension [SC01]",
        packageId: "616301",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd01/GD01-025_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-025_p2.webp?260715",
      productName: "Deck Build Box Freedom Ascension [SC01]",
    },
  ],
  reprints: ["GD01-025", "GD01-025_p1", "GD01-025_p2"],
  selectedPrintingId: "GD01-025",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd01/GD01-025.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-025.webp?260715",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 5,
  hp: 4,
  linkCondition: "[Duo Maxwell]",
  effect:
    "【When Paired･(Operation Meteor) Pilot】Place 1 rested Resource. Then, this Unit gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "operation meteor",
        },
      },
      directives: [
        {
          action: {
            action: "placeResource",
            state: "rested",
          },
        },
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【When Paired·(Operation Meteor) Pilot】Place 1 rested Resource. Then, this Unit gains <First Strike> during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
