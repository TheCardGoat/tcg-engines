import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05BecomeAShield117: CommandCard = {
  cardNumber: "GD05-117",
  name: "Become a Shield",
  type: "command",
  color: "purple",
  traits: ["tekkadan", "alaya-vijnana"],
  id: "GD05-117",
  canonicalId: "GD05-117",
  externalIds: { bandai: "gundam:gd05-117" },
  slug: "become-a-shield-gd05-117",
  displayName: "Become a Shield",
  rulesText:
    "【Main】/【Action】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.\n【Pilot】[Ride Mass]",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-117",
  printings: [
    {
      id: "GD05-117",
      artId: "GD05-117",
      setCode: "GD05",
      collectorNumber: "GD05-117",
      cardNumber: "GD05-117",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-117.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-117",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-117.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Iron-Blooded Orphans",
  level: 3,
  cost: 1,
  pilotName: "Ride Mass",
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.\n【Pilot】[Ride Mass]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
          sharesTargetChoiceWithPrevious: true,
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
