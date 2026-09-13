import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GquuuuuuxOmegaPsycommu024: UnitCard = {
  cardNumber: "EB01-024",
  name: "GQuuuuuuX (Omega Psycommu)",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-024",
  canonicalId: "EB01-024",
  externalIds: { bandai: "gundam:eb01-024" },
  slug: "gquuuuuux-omega-psycommu-eb01-024",
  displayName: "GQuuuuuuX (Omega Psycommu)",
  rulesText:
    "<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Attack】Choose 1 enemy Unit with <Blocker> that is Lv.5 or lower. Deal 2 damage to it.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-024",
  printings: [
    {
      id: "EB01-024",
      artId: "EB01-024",
      setCode: "EB01",
      collectorNumber: "EB01-024",
      cardNumber: "EB01-024",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-024.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-024",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-024.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "(Attack) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Attack】Choose 1 enemy Unit with <Blocker> that is Lv.5 or lower. Deal 2 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 5,
                },
              ],
              hasKeyword: "Blocker",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Attack】Choose 1 enemy Unit with <Blocker> that is Lv.5 or lower. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 3 }],
  rarity: "rare",
};
