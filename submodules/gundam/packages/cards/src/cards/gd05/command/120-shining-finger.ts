import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05ShiningFinger120: CommandCard = {
  cardNumber: "GD05-120",
  name: "Shining Finger",
  type: "command",
  color: "white",
  traits: ["shuffle alliance", "special move"],
  id: "GD05-120",
  canonicalId: "GD05-120",
  externalIds: { bandai: "gundam:gd05-120" },
  slug: "shining-finger-gd05-120",
  displayName: "Shining Finger",
  rulesText:
    '【Burst】Add this card to your hand.\n【Main】/【Action】Choose 1 enemy Unit with 4 or less HP. Rest it. Then, you may choose 1 of your Units with "Shining Gundam" in its card name. It gets <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)',
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-120",
  printings: [
    {
      id: "GD05-120",
      artId: "GD05-120",
      setCode: "GD05",
      collectorNumber: "GD05-120",
      cardNumber: "GD05-120",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-120.webp",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-120-p1",
      artId: "GD05-120_p1",
      setCode: "GD05",
      collectorNumber: "GD05-120-p1",
      cardNumber: "GD05-120",
      set: { code: "GD05", name: "Promotion card", packageId: "616901" },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-120_p1.webp",
      productName:
        "Booster Pack Freedom Ascension [GD05] Release Event Commemorative Items for Participants",
    },
  ],
  selectedPrintingId: "GD05-120",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-120.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 4,
  cost: 1,
  effect:
    '【Burst】Add this card to your hand.\n【Main】/【Action】Choose 1 enemy Unit with 4 or less HP. Rest it. Then, you may choose 1 of your Units with "Shining Gundam" in its card name. It gets <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)',
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
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
        {
          // "Then, you may" is an optional second choice. Modeling the
          // optionality on the directive (rather than as a 0..1 target
          // count) prevents an empty Shining Gundam pool from becoming a
          // required zero-target selection in the client.
          dependsOnPrevious: true,
          optional: true,
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "name",
                  comparison: "includes",
                  value: "Shining Gundam",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        '【Main】/【Action】Choose 1 enemy Unit with 4 or less HP. Rest it. Then, you may choose 1 of your Units with "Shining Gundam" in its card name. It gets <First Strike> during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.)',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
