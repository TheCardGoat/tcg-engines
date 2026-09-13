import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb0130cmCannonApfsdsRound084: CommandCard = {
  cardNumber: "EB01-084",
  name: "30cm Cannon (APFSDS Round)",
  type: "command",
  color: "white",
  traits: ["g generation", "attack"],
  id: "EB01-084",
  canonicalId: "EB01-084",
  externalIds: { bandai: "gundam:eb01-084" },
  slug: "30cm-cannon-apfsds-round-eb01-084",
  displayName: "30cm Cannon (APFSDS Round)",
  rulesText:
    "【Main】/【Action】Choose 1 Unit with <Blocker>. Set it as active. It can't attack during this turn.\n【Pilot】[Demeziere Sonnen]",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-084",
  printings: [
    {
      id: "EB01-084",
      artId: "EB01-084",
      setCode: "EB01",
      collectorNumber: "EB01-084",
      cardNumber: "EB01-084",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-084.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-084",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-084.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  pilotName: "Demeziere Sonnen",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 Unit with <Blocker>. Set it as active. It can't attack during this turn.\n【Pilot】[Demeziere Sonnen]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "any",
              cardType: "unit",
              hasKeyword: "Blocker",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "cantAttack",
            duration: "thisTurn",
            target: {
              owner: "any",
              cardType: "unit",
              hasKeyword: "Blocker",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 Unit with <Blocker>. Set it as active. It can't attack during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
