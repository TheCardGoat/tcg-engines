import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01ZudahUnit1037: UnitCard = {
  cardNumber: "EB01-037",
  name: "Zudah Unit 1",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-037",
  canonicalId: "EB01-037",
  externalIds: { bandai: "gundam:eb01-037" },
  slug: "zudah-unit-1-eb01-037",
  displayName: "Zudah Unit 1",
  rulesText:
    "During your turn, while this Unit is battling an enemy Unit with <Blocker>, this Unit can't receive battle damage.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-037",
  printings: [
    {
      id: "EB01-037",
      artId: "EB01-037",
      setCode: "EB01",
      collectorNumber: "EB01-037",
      cardNumber: "EB01-037",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-037.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-037",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-037.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 1,
  linkCondition: "[Jean Luc Duvall]",
  battlefieldZones: ["space", "earth"],
  effect:
    "During your turn, while this Unit is battling an enemy Unit with <Blocker>, this Unit can't receive battle damage.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: { owner: "self", cardType: "unit" },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              hasKeyword: "Blocker",
              isBattling: true,
            },
            damageType: "battle",
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "During your turn, while this Unit is battling an enemy Unit with <Blocker>, this Unit can't receive battle damage.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
