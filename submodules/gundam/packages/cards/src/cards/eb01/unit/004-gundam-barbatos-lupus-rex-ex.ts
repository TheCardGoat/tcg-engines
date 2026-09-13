import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamBarbatosLupusRexEx004: UnitCard = {
  cardNumber: "EB01-004",
  name: "Gundam Barbatos Lupus Rex (EX)",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-004",
  canonicalId: "EB01-004",
  externalIds: { bandai: "gundam:eb01-004" },
  slug: "gundam-barbatos-lupus-rex-ex-eb01-004",
  displayName: "Gundam Barbatos Lupus Rex (EX)",
  rulesText:
    "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\n【Once per Turn】During your turn, when this Unit recovers HP, choose 1 rested enemy Unit. Deal 1 damage to it.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-004",
  printings: [
    {
      id: "EB01-004",
      artId: "EB01-004",
      setCode: "EB01",
      collectorNumber: "EB01-004",
      cardNumber: "EB01-004",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-004.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-004-p1",
      artId: "EB01-004_p1",
      setCode: "EB01",
      collectorNumber: "EB01-004-p1",
      cardNumber: "EB01-004",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-004_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-004",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-004.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 6,
  cost: 5,
  ap: 3,
  hp: 5,
  linkCondition: "(Attack) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\n【Once per Turn】During your turn, when this Unit recovers HP, choose 1 rested enemy Unit. Deal 1 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenHealed"],
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
          {
            type: "eventCardIsSelf",
          },
        ],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】During your turn, when this Unit recovers HP, choose 1 rested enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Repair", value: 2 }],
  rarity: "rare",
};
