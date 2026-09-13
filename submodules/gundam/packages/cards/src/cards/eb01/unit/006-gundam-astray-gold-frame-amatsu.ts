import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamAstrayGoldFrameAmatsu006: UnitCard = {
  cardNumber: "EB01-006",
  name: "Gundam Astray Gold Frame Amatsu",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-006",
  canonicalId: "EB01-006",
  externalIds: { bandai: "gundam:eb01-006" },
  slug: "gundam-astray-gold-frame-amatsu-eb01-006",
  displayName: "Gundam Astray Gold Frame Amatsu",
  rulesText:
    "【Deploy】Choose 1 of your Units. It gains <Repair 1> during this turn.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-006",
  printings: [
    {
      id: "EB01-006",
      artId: "EB01-006",
      setCode: "EB01",
      collectorNumber: "EB01-006",
      cardNumber: "EB01-006",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-006.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-006-p1",
      artId: "EB01-006_p1",
      setCode: "EB01",
      collectorNumber: "EB01-006-p1",
      cardNumber: "EB01-006",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-006_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-006",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-006.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "(Attack) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】Choose 1 of your Units. It gains <Repair 1> during this turn.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your Units. It gains <Repair 1> during this turn. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
