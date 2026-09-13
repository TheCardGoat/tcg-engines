import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05Asshimar007: UnitCard = {
  cardNumber: "GD05-007",
  name: "Asshimar",
  type: "unit",
  color: "blue",
  traits: ["titans"],
  id: "GD05-007",
  canonicalId: "GD05-007",
  externalIds: { bandai: "gundam:gd05-007" },
  slug: "asshimar-gd05-007",
  displayName: "Asshimar",
  rulesText:
    "【During Link】This Unit gets AP+2 and <Repair 1>.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-007",
  printings: [
    {
      id: "GD05-007",
      artId: "GD05-007",
      setCode: "GD05",
      collectorNumber: "GD05-007",
      cardNumber: "GD05-007",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-007.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-007",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-007.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Z Gundam",
  level: 3,
  cost: 2,
  ap: 1,
  hp: 4,
  linkCondition: "(Titans) Trait",
  battlefieldZones: ["earth"],
  effect:
    "【During Link】This Unit gets AP+2 and <Repair 1>.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "duringLink",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Link】This Unit gets AP+2 and <Repair 1>. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
