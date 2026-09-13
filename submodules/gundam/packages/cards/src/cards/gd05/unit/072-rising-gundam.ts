import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05RisingGundam072: UnitCard = {
  cardNumber: "GD05-072",
  name: "Rising Gundam",
  type: "unit",
  color: "white",
  traits: ["mf"],
  id: "GD05-072",
  canonicalId: "GD05-072",
  externalIds: { bandai: "gundam:gd05-072" },
  slug: "rising-gundam-gd05-072",
  displayName: "Rising Gundam",
  rulesText: "【When Linked】Choose 1 enemy Unit with 4 or less HP. Rest it.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-072",
  printings: [
    {
      id: "GD05-072",
      artId: "GD05-072",
      setCode: "GD05",
      collectorNumber: "GD05-072",
      cardNumber: "GD05-072",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-072.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-072",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-072.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "(Gundam Fighter) Trait",
  battlefieldZones: ["space", "earth"],
  effect: "【When Linked】Choose 1 enemy Unit with 4 or less HP. Rest it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【When Linked】Choose 1 enemy Unit with 4 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
