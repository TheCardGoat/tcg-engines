import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01ByarlantCustom019: UnitCard = {
  cardNumber: "GD01-019",
  name: "Byarlant Custom",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "GD01-019",
  canonicalId: "GD01-019",
  externalIds: { bandai: "gundam:gd01-019" },
  slug: "byarlant-custom/gd01-019",
  displayName: "Byarlant Custom",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-019",
  printings: [
    {
      id: "GD01-019",
      artId: "GD01-019",
      setCode: "GD01",
      collectorNumber: "GD01-019",
      cardNumber: "GD01-019",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-019.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-019.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  reprints: ["GD01-019"],
  selectedPrintingId: "GD01-019",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-019.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-019.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 4,
  effect:
    "While 4 or more enemy Units are in play, this Unit gains &lt;Blocker&gt;.<br>\n(Rest this Unit to change the attack target to it.)<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "unitCount", owner: "opponent", comparison: "gte", count: 4 }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: { owner: "self" },
          },
        },
      ],
      sourceText: "While 4 or more enemy Units are in play, this Unit gains <Blocker>.",
    },
  ] satisfies CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
