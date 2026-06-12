import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02PsychoGundam001: UnitCard = {
  cardNumber: "GD02-001",
  name: "Psycho Gundam",
  type: "unit",
  color: "blue",
  traits: ["titans"],
  id: "GD02-001",
  externalId: "gundam:gd02-001",
  slug: "psycho-gundam-gd02-001",
  displayName: "Psycho Gundam",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-001",
  printings: [
    {
      id: "GD02-001",
      collectorNumber: "GD02-001",
      cardNumber: "GD02-001",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-001.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-001.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-001_p1",
      collectorNumber: "GD02-001_p1",
      cardNumber: "GD02-001",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-001_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-001_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-001",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-001.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-001.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 4,
  hp: 5,
  linkCondition: "[Four Murasame]",
  effect:
    "<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【During Pair･(Cyber-Newtype) Pilot】When one of your (Titans) Units destroys an enemy shield area card with damage, this Unit recovers 2 HP.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onShieldAreaCardDestroyByBattle"],
        conditions: [
          { type: "duringPair" },
          { type: "selfPairedPilotHasTrait", trait: "cyber-newtype" },
          { type: "isTurn", whose: "friendly" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "titans" }],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Pair･(Cyber-Newtype) Pilot】When one of your (Titans) Units destroys an enemy shield area card with damage, this Unit recovers 2 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 3 }],
  rarity: "legendRare",
};
