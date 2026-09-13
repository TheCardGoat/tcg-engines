import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05GyuneiGuss095: PilotCard = {
  cardNumber: "GD05-095",
  name: "Gyunei Guss",
  type: "pilot",
  color: "purple",
  traits: ["neo zeon", "cyber-newtype"],
  id: "GD05-095",
  canonicalId: "GD05-095",
  externalIds: { bandai: "gundam:gd05-095" },
  slug: "gyunei-guss-gd05-095",
  displayName: "Gyunei Guss",
  rulesText:
    "【Burst】Add this card to your hand.\nWhile this Unit is (Neo Zeon), it gains <Blocker>.\n\n(Rest this Unit to change the attack target to it.)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-095",
  printings: [
    {
      id: "GD05-095",
      artId: "GD05-095",
      setCode: "GD05",
      collectorNumber: "GD05-095",
      cardNumber: "GD05-095",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-095.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-095",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-095.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\nWhile this Unit is (Neo Zeon), it gains <Blocker>.\n\n(Rest this Unit to change the attack target to it.)",
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
            trait: "neo zeon",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While this Unit is (Neo Zeon), it gains <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
