import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamFlightForm036: UnitCard = {
  cardNumber: "GD03-036",
  name: "Ξ Gundam (Flight Form)",
  type: "unit",
  color: "red",
  traits: ["mafty"],
  id: "GD03-036",
  canonicalId: "GD03-036",
  externalIds: { bandai: "gundam:gd03-036" },
  slug: "gundam-flight-form/gd03-036",
  displayName: "Ξ Gundam (Flight Form)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-036",
  printings: [
    {
      id: "GD03-036",
      artId: "GD03-036",
      setCode: "GD03",
      collectorNumber: "GD03-036",
      cardNumber: "GD03-036",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd03/GD03-036.webp",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-036_p1",
      artId: "GD03-036_p1",
      setCode: "GD03",
      collectorNumber: "GD03-036_p1",
      cardNumber: "GD03-036",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd03/GD03-036_p1.webp",
      productName: "Steel Requiem[GD03]",
    },
  ],
  reprints: ["GD03-036", "GD03-036_p1"],
  selectedPrintingId: "GD03-036",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd03/GD03-036.webp",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Hathaway Noa]",
  effect: "【When Linked】Deal 1 damage to all enemy Units.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【When Linked】Deal 1 damage to all enemy Units.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
