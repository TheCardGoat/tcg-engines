import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamDx049: UnitCard = {
  cardNumber: "GD04-049",
  name: "Gundam DX",
  type: "unit",
  color: "purple",
  traits: ["vulture"],
  id: "GD04-049",
  externalId: "gundam:gd04-049",
  slug: "gundam-dx-gd04-049",
  displayName: "Gundam DX",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-049",
  printings: [
    {
      id: "GD04-049",
      collectorNumber: "GD04-049",
      cardNumber: "GD04-049",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-049.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-049.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-049_p1",
      collectorNumber: "GD04-049_p1",
      cardNumber: "GD04-049",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-049_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-049_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-049",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-049.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-049.webp?260424",
  legality: "legal",
  level: 8,
  cost: 7,
  ap: 6,
  hp: 6,
  linkCondition: "[Garrod Ran]",
  effect:
    "<Suppression> (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\n【During Pair】【Attack】If you are attacking the enemy player, you may choose 7 (Vulture) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit/Base that is Lv.8 or lower. Destroy it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringPair" }, { type: "isAttackingPlayer" }],
      },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 7,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "vulture" }],
            },
          },
          optional: true,
        },
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: ["unit", "base"],
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 8,
                },
              ],
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【During Pair】【Attack】If you are attacking the enemy player, you may choose 7 (Vulture) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit/Base that is Lv.8 or lower. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Suppression" }],
  rarity: "legendRare",
};
