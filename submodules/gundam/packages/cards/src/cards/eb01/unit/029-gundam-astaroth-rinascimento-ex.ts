import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamAstarothRinascimentoEx029: UnitCard = {
  cardNumber: "EB01-029",
  name: "Gundam Astaroth Rinascimento (EX)",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-029",
  canonicalId: "EB01-029",
  externalIds: { bandai: "gundam:eb01-029" },
  slug: "gundam-astaroth-rinascimento-ex-eb01-029",
  displayName: "Gundam Astaroth Rinascimento (EX)",
  rulesText:
    "【Deploy】If 5 or more enemy Units are in play, deal 2 damage to all Units with <Blocker> that are Lv.4 or lower.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-029",
  printings: [
    {
      id: "EB01-029",
      artId: "EB01-029",
      setCode: "EB01",
      collectorNumber: "EB01-029",
      cardNumber: "EB01-029",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-029.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-029",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-029.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "(Support) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】If 5 or more enemy Units are in play, deal 2 damage to all Units with <Blocker> that are Lv.4 or lower.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "opponent",
            comparison: "gte",
            count: 5,
          },
          thenDirectives: [
            {
              action: {
                action: "dealDamageAll",
                amount: 2,
                target: {
                  owner: "any",
                  cardType: "unit",
                  attributeFilters: [
                    {
                      attribute: "level",
                      comparison: "lte",
                      value: 4,
                    },
                  ],
                  hasKeyword: "Blocker",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】If 5 or more enemy Units are in play, deal 2 damage to all Units with <Blocker> that are Lv.4 or lower.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
