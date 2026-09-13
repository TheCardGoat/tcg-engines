import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05OvercomingHardships108: CommandCard = {
  cardNumber: "GD05-108",
  name: "Overcoming Hardships",
  type: "command",
  color: "green",
  traits: ["academy"],
  id: "GD05-108",
  canonicalId: "GD05-108",
  externalIds: { bandai: "gundam:gd05-108" },
  slug: "overcoming-hardships-gd05-108",
  displayName: "Overcoming Hardships",
  rulesText:
    "【Action】Choose 1 friendly rested (Academy) Unit. Change a battling enemy Unit's attack target to it.\n【Pilot】[Guel Jeturk]",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-108",
  printings: [
    {
      id: "GD05-108",
      artId: "GD05-108",
      setCode: "GD05",
      collectorNumber: "GD05-108",
      cardNumber: "GD05-108",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-108.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-108",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-108.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 3,
  cost: 1,
  pilotName: "Guel Jeturk",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Action】Choose 1 friendly rested (Academy) Unit. Change a battling enemy Unit's attack target to it.\n【Pilot】[Guel Jeturk]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "changeAttackTarget",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "rested",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "academy" }],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 friendly rested (Academy) Unit. Change a battling enemy Unit's attack target to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
