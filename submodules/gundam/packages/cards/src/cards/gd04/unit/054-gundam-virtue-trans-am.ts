import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamVirtueTransAm054: UnitCard = {
  cardNumber: "GD04-054",
  name: "Gundam Virtue (Trans-Am)",
  type: "unit",
  color: "purple",
  traits: ["cb", "gn drive"],
  id: "GD04-054",
  canonicalId: "GD04-054",
  externalIds: { bandai: "gundam:gd04-054" },
  slug: "gundam-virtue-trans-am/gd04-054",
  displayName: "Gundam Virtue (Trans-Am)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-054",
  printings: [
    {
      id: "GD04-054",
      artId: "GD04-054",
      setCode: "GD04",
      collectorNumber: "GD04-054",
      cardNumber: "GD04-054",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-054.webp",
      productName: "Phantom Aria [GD04]",
    },
  ],
  reprints: ["GD04-054"],
  selectedPrintingId: "GD04-054",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd04/GD04-054.webp",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 2,
  hp: 6,
  linkCondition: "[Tieria Erde]",
  effect: "When this Unit deals battle damage to an enemy Unit, destroy that enemy Unit.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onBattleDamageDealtToUnit"],
        conditions: [
          { type: "eventSourceIsSelf" },
          {
            type: "eventCardMatches",
            target: { owner: "opponent", cardType: "unit" },
          },
        ],
      },
      directives: [{ action: { action: "destroyEventCard" } }],
      sourceText: "When this Unit deals battle damage to an enemy Unit, destroy that enemy Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
