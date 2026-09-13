import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01StrikeFreedomGundamEx041: UnitCard = {
  cardNumber: "EB01-041",
  name: "Strike Freedom Gundam (EX)",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-041",
  canonicalId: "EB01-041",
  externalIds: { bandai: "gundam:eb01-041" },
  slug: "strike-freedom-gundam-ex-eb01-041",
  displayName: "Strike Freedom Gundam (EX)",
  rulesText:
    "<High-Maneuver> (This Unit can't be blocked.)\n【Deploy】Choose 1 Unit with 4 or less HP belonging to each enemy player. Return them to their owners' hands.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-041",
  printings: [
    {
      id: "EB01-041",
      artId: "EB01-041",
      setCode: "EB01",
      collectorNumber: "EB01-041",
      cardNumber: "EB01-041",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-041.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-041-p1",
      artId: "EB01-041_p1",
      setCode: "EB01",
      collectorNumber: "EB01-041-p1",
      cardNumber: "EB01-041",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-041_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-041",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-041.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 7,
  cost: 6,
  ap: 5,
  hp: 5,
  linkCondition: "(Attack) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "<High-Maneuver> (This Unit can't be blocked.)\n【Deploy】Choose 1 Unit with 4 or less HP belonging to each enemy player. Return them to their owners' hands.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "opponents",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "returnToHand",
                    target: {
                      owner: "friendly",
                      cardType: "unit",
                      count: 1,
                      attributeFilters: [{ attribute: "hp", comparison: "lte", value: 4 }],
                    },
                  },
                },
              ],
              sourceText:
                "Choose 1 of your Units with 4 or less HP. Return it to its owner's hand.",
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 Unit with 4 or less HP belonging to each enemy player. Return them to their owners' hands.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "HighManeuver" }],
  rarity: "legendRare",
};
