import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01SaikoroGundam050: UnitCard = {
  cardNumber: "EB01-050",
  name: "Saikoro Gundam",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-050",
  canonicalId: "EB01-050",
  externalIds: { bandai: "gundam:eb01-050" },
  slug: "saikoro-gundam-eb01-050",
  displayName: "Saikoro Gundam",
  rulesText:
    "【Attack】Place the top card of your deck into your trash. If you placed a card that is Lv.3 or higher with this effect, choose 1 enemy Unit. It gets AP-2 during this battle.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-050",
  printings: [
    {
      id: "EB01-050",
      artId: "EB01-050",
      setCode: "EB01",
      collectorNumber: "EB01-050",
      cardNumber: "EB01-050",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-050.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-050",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-050.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 6,
  cost: 6,
  ap: 5,
  hp: 6,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Attack】Place the top card of your deck into your trash. If you placed a card that is Lv.3 or higher with this effect, choose 1 enemy Unit. It gets AP-2 during this battle.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "millDeckThenStatModifierIfLevel",
            count: 1,
            owner: "self",
            minLevel: 3,
            stat: "ap",
            amount: -2,
            duration: "thisBattle",
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText:
        "【Attack】Place the top card of your deck into your trash. If you placed a card that is Lv.3 or higher with this effect, choose 1 enemy Unit. It gets AP-2 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
