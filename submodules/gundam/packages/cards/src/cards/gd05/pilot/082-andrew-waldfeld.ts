import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05AndrewWaldfeld082: PilotCard = {
  cardNumber: "GD05-082",
  name: "Andrew Waldfeld",
  type: "pilot",
  color: "blue",
  traits: ["orb", "coordinator"],
  id: "GD05-082",
  canonicalId: "GD05-082",
  externalIds: { bandai: "gundam:gd05-082" },
  slug: "andrew-waldfeld-gd05-082",
  displayName: "Andrew Waldfeld",
  rulesText:
    "【Burst】Add this card to your hand.\n【During Link】This Unit gains <Repair 2>.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-082",
  printings: [
    {
      id: "GD05-082",
      artId: "GD05-082",
      setCode: "GD05",
      collectorNumber: "GD05-082",
      cardNumber: "GD05-082",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-082.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-082",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-082.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】This Unit gains <Repair 2>.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)",
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
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 2,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Link】This Unit gains <Repair 2>. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
