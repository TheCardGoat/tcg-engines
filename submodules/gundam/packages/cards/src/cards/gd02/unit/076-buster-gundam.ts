import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02BusterGundam076: UnitCard = {
  cardNumber: "GD02-076",
  name: "Buster Gundam",
  type: "unit",
  color: "white",
  traits: ["triple ship alliance"],
  id: "GD02-076",
  externalId: "gundam:gd02-076",
  slug: "buster-gundam-gd02-076",
  displayName: "Buster Gundam",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-076",
  printings: [
    {
      id: "GD02-076",
      collectorNumber: "GD02-076",
      cardNumber: "GD02-076",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-076.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-076.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-076_p1",
      collectorNumber: "GD02-076_p1",
      cardNumber: "GD02-076",
      set: {
        code: "ST09",
        name: "Destiny Ignition [ST09]",
        packageId: "616009",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-076_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-076_p1.webp?260424",
      productName: "Destiny Ignition [ST09]",
    },
  ],
  selectedPrintingId: "GD02-076",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-076.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-076.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  effect:
    "While this Unit has 5 or more AP, it gains &lt;Blocker&gt;.<br>\n(Rest this Unit to change the attack target to it.)<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "selfStat",
            stat: "ap",
            comparison: "gte",
            value: 5,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While this Unit has 5 or more AP, it gains <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
