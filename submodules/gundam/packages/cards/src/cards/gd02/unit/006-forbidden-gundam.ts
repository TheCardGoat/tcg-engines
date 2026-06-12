import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02ForbiddenGundam006: UnitCard = {
  cardNumber: "GD02-006",
  name: "Forbidden Gundam",
  type: "unit",
  color: "blue",
  traits: ["earth alliance"],
  id: "GD02-006",
  externalId: "gundam:gd02-006",
  slug: "forbidden-gundam-gd02-006",
  displayName: "Forbidden Gundam",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-006",
  printings: [
    {
      id: "GD02-006",
      collectorNumber: "GD02-006",
      cardNumber: "GD02-006",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-006.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-006.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-006_p1",
      collectorNumber: "GD02-006_p1",
      cardNumber: "GD02-006",
      set: {
        code: "GD02",
        name: "Store Tournament Participant Pack 04",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-006_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-006_p1.webp?260424",
      productName: "Store Tournament Participant Pack 04",
    },
    {
      id: "GD02-006_p2",
      collectorNumber: "GD02-006_p2",
      cardNumber: "GD02-006",
      set: {
        code: "GD02",
        name: "Store Tournament Winner Pack 04",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-006_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-006_p2.webp?260424",
      productName: "Store Tournament Winner Pack 04",
    },
  ],
  selectedPrintingId: "GD02-006",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-006.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-006.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  effect:
    "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)<br>During your turn, this Unit can't receive battle damage from enemy Units that are Lv.2 or lower.<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "isTurn", whose: "friendly" }],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: { owner: "self" },
            damageType: "battle",
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
            },
          },
        },
      ],
      sourceText:
        "During your turn, this Unit can't receive battle damage from enemy Units that are Lv.2 or lower.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "rare",
};
