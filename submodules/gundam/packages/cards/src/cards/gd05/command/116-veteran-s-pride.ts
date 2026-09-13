import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05VeteranSPride116: CommandCard = {
  cardNumber: "GD05-116",
  name: "Veteran's Pride",
  type: "command",
  color: "purple",
  traits: ["neo zeon"],
  id: "GD05-116",
  canonicalId: "GD05-116",
  externalIds: { bandai: "gundam:gd05-116" },
  slug: "veteran-s-pride-gd05-116",
  displayName: "Veteran's Pride",
  rulesText:
    "【Main】/【Action】Choose 1 enemy Unit that is Lv.2 or lower. Destroy it.\n【Pilot】[Rezin Schnyder]",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-116",
  printings: [
    {
      id: "GD05-116",
      artId: "GD05-116",
      setCode: "GD05",
      collectorNumber: "GD05-116",
      cardNumber: "GD05-116",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-116.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-116",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-116.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 2,
  cost: 1,
  pilotName: "Rezin Schnyder",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】Choose 1 enemy Unit that is Lv.2 or lower. Destroy it.\n【Pilot】[Rezin Schnyder]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Main】/【Action】Choose 1 enemy Unit that is Lv.2 or lower. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
