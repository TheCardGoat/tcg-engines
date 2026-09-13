import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05ForbiddenGundam012: UnitCard = {
  cardNumber: "GD05-012",
  name: "Forbidden Gundam",
  type: "unit",
  color: "blue",
  traits: ["earth alliance"],
  id: "GD05-012",
  canonicalId: "GD05-012",
  externalIds: { bandai: "gundam:gd05-012" },
  slug: "forbidden-gundam-gd05-012",
  displayName: "Forbidden Gundam",
  rulesText:
    "【When Linked】Choose 1 rested enemy Unit that is Lv.3 or lower. Return it to its owner's hand.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-012",
  printings: [
    {
      id: "GD05-012",
      artId: "GD05-012",
      setCode: "GD05",
      collectorNumber: "GD05-012",
      cardNumber: "GD05-012",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-012.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-012",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-012.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "(Biological CPU) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【When Linked】Choose 1 rested enemy Unit that is Lv.3 or lower. Return it to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Linked】Choose 1 rested enemy Unit that is Lv.3 or lower. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
