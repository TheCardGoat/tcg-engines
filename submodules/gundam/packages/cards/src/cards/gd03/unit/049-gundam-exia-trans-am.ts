import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamExiaTransAm049: UnitCard = {
  cardNumber: "GD03-049",
  name: "Gundam Exia (Trans-Am)",
  type: "unit",
  color: "purple",
  traits: ["cb", "gn drive"],
  id: "GD03-049",
  externalId: "gundam:gd03-049",
  slug: "gundam-exia-trans-am-gd03-049",
  displayName: "Gundam Exia (Trans-Am)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-049",
  printings: [
    {
      id: "GD03-049",
      collectorNumber: "GD03-049",
      cardNumber: "GD03-049",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-049.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-049.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-049_p1",
      collectorNumber: "GD03-049_p1",
      cardNumber: "GD03-049",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-049_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-049_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-049",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-049.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-049.webp?260424",
  legality: "legal",
  level: 7,
  cost: 6,
  ap: 6,
  hp: 4,
  linkCondition: "[Setsuna F. Seiei]",
  effect:
    "<Suppression> (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\nWhen this Unit destroys an enemy shield area card with battle damage, if there are 10 or more (CB) cards in your trash, choose 1 enemy Unit with the lowest HP. Destroy it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onShieldAreaCardDestroyByBattle"],
        conditions: [
          { type: "eventCardIsSelf" },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 10,
            hasTrait: "cb",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              lowest: "hp",
            },
          },
        },
      ],
      sourceText:
        "When this Unit destroys an enemy shield area card with battle damage, if there are 10 or more (CB) cards in your trash, choose 1 enemy Unit with the lowest HP. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Suppression" }],
  rarity: "legendRare",
};
