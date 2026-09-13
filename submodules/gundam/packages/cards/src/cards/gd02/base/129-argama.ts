import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd02Argama129: BaseCard = {
  cardNumber: "GD02-129",
  name: "Argama",
  type: "base",
  color: "white",
  traits: ["aeug", "warship"],
  id: "GD02-129",
  canonicalId: "GD02-129",
  externalIds: { bandai: "gundam:gd02-129" },
  slug: "argama/gd02-129",
  displayName: "Argama",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-129",
  printings: [
    {
      id: "GD02-129",
      artId: "GD02-129",
      setCode: "GD02",
      collectorNumber: "GD02-129",
      cardNumber: "GD02-129",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-129.webp",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-129_p1",
      artId: "GD02-129_p1",
      setCode: "GD02",
      collectorNumber: "GD02-129_p1",
      cardNumber: "GD02-129",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-129_p1.webp",
      productName: "Dual Impact [GD02]",
    },
  ],
  reprints: ["GD02-129", "GD02-129_p1"],
  selectedPrintingId: "GD02-129",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd02/GD02-129.webp",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\nThis Base can't receive enemy effect damage.<br>",
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
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "preventDamage",
            target: { owner: "self", cardType: "base" },
            damageType: "effect",
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
      sourceText: "This Base can't receive enemy effect damage.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
