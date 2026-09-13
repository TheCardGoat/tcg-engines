import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01JusticeGundamEx044: UnitCard = {
  cardNumber: "EB01-044",
  name: "Justice Gundam (EX)",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-044",
  canonicalId: "EB01-044",
  externalIds: { bandai: "gundam:eb01-044" },
  slug: "justice-gundam-ex-eb01-044",
  displayName: "Justice Gundam (EX)",
  rulesText:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【Deploy】If there are 2 or more enemy players, choose 1 Unit belonging to an enemy player with the most Units. Return it to its owner's hand.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-044",
  printings: [
    {
      id: "EB01-044",
      artId: "EB01-044",
      setCode: "EB01",
      collectorNumber: "EB01-044",
      cardNumber: "EB01-044",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-044.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-044-p1",
      artId: "EB01-044_p1",
      setCode: "EB01",
      collectorNumber: "EB01-044-p1",
      cardNumber: "EB01-044",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-044_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-044",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-044.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "(Durability) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【Deploy】If there are 2 or more enemy players, choose 1 Unit belonging to an enemy player with the most Units. Return it to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "enemyPlayerCount", comparison: "gte", count: 2 }],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "any",
              cardType: "unit",
              count: 1,
              ownerHasMostUnits: true,
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If there are 2 or more enemy players, choose 1 Unit belonging to an enemy player with the most Units. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "rare",
};
