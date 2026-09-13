import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01PsychoZakuEx045: UnitCard = {
  cardNumber: "EB01-045",
  name: "Psycho Zaku (EX)",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-045",
  canonicalId: "EB01-045",
  externalIds: { bandai: "gundam:eb01-045" },
  slug: "psycho-zaku-ex-eb01-045",
  displayName: "Psycho Zaku (EX)",
  rulesText:
    "<Suppression> (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\n【When Paired】Choose 1 enemy Unit with <Repair>. Return it to its owner's hand.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-045",
  printings: [
    {
      id: "EB01-045",
      artId: "EB01-045",
      setCode: "EB01",
      collectorNumber: "EB01-045",
      cardNumber: "EB01-045",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-045.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-045-p1",
      artId: "EB01-045_p1",
      setCode: "EB01",
      collectorNumber: "EB01-045-p1",
      cardNumber: "EB01-045",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-045_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-045",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-045.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 7,
  cost: 5,
  ap: 4,
  hp: 6,
  linkCondition: "[Daryl Lorenz]",
  battlefieldZones: ["space", "earth"],
  effect:
    "<Suppression> (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\n【When Paired】Choose 1 enemy Unit with <Repair>. Return it to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              hasKeyword: "Repair",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Paired】Choose 1 enemy Unit with <Repair>. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Suppression" }],
  rarity: "rare",
};
