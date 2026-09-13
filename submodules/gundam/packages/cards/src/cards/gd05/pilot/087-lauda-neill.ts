import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05LaudaNeill087: PilotCard = {
  cardNumber: "GD05-087",
  name: "Lauda Neill",
  type: "pilot",
  color: "green",
  traits: ["academy"],
  id: "GD05-087",
  canonicalId: "GD05-087",
  externalIds: { bandai: "gundam:gd05-087" },
  slug: "lauda-neill-gd05-087",
  displayName: "Lauda Neill",
  rulesText:
    "【Burst】Add this card to your hand.\nWhile this Unit is (Academy), it gains <High-Maneuver>.\n\n(This Unit can't be blocked.)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-087",
  printings: [
    {
      id: "GD05-087",
      artId: "GD05-087",
      setCode: "GD05",
      collectorNumber: "GD05-087",
      cardNumber: "GD05-087",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-087.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-087",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-087.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\nWhile this Unit is (Academy), it gains <High-Maneuver>.\n\n(This Unit can't be blocked.)",
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
            type: "selfHasTrait",
            trait: "academy",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While this Unit is (Academy), it gains <High-Maneuver>. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
