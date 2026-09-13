import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05MasterAsia089: PilotCard = {
  cardNumber: "GD05-089",
  name: "Master Asia",
  type: "pilot",
  color: "red",
  traits: ["gundam fighter"],
  id: "GD05-089",
  canonicalId: "GD05-089",
  externalIds: { bandai: "gundam:gd05-089" },
  slug: "master-asia-gd05-089",
  displayName: "Master Asia",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-089",
  printings: [
    {
      id: "GD05-089",
      artId: "GD05-089",
      setCode: "GD05",
      collectorNumber: "GD05-089",
      cardNumber: "GD05-089",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-089.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-089.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
    {
      id: "GD05-089_p1",
      artId: "GD05-089_p1",
      setCode: "GD05",
      collectorNumber: "GD05-089_p1",
      cardNumber: "GD05-089",
      set: {
        code: "GD05",
        name: "Freedom Ascension [GD05]",
        packageId: "616105",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-089_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-089_p1.webp?260715",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  reprints: ["GD05-089", "GD05-089_p1"],
  selectedPrintingId: "GD05-089",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-089.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD05-089.webp?260715",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 6,
  cost: 1,
  apBonus: 2,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand. If there are 3 or more (MF) cards in your trash, you may deploy it as an (AP3・HP3) Unit instead. (Don't treat it as a Pilot.)\n【During Link】【Attack】If you have activated a (Special Move) Command card's 【Main】/【Action】 during this turn, choose 1 enemy Unit. Deal 2 damage to it.",
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
        {
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 3,
            hasTrait: "mf",
          },
          thenDirectives: [
            {
              action: {
                action: "deploySelfAsUnit",
                ap: 3,
                hp: 3,
              },
              optional: true,
            },
          ],
        },
      ],
      sourceText:
        "【Burst】Add this card to your hand. If there are 3 or more (MF) cards in your trash, you may deploy it as an (AP3·HP3) Unit instead. (Don't treat it as a Pilot.)",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "duringLink",
          },
          {
            type: "activatedCommandThisTurn",
            owner: "friendly",
            target: {
              owner: "friendly",
              cardType: "command",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "special move",
                },
              ],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Attack】If you have activated a (Special Move) Command card's 【Main】/【Action】 during this turn, choose 1 enemy Unit. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
