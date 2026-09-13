import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01LeCygneEx023: UnitCard = {
  cardNumber: "EB01-023",
  name: "Le Cygne (EX)",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-023",
  canonicalId: "EB01-023",
  externalIds: { bandai: "gundam:eb01-023" },
  slug: "le-cygne-ex-eb01-023",
  displayName: "Le Cygne (EX)",
  rulesText:
    "【Attack】All players each look at the top card of their deck. If it is a card that is Lv.5 or higher, they may reveal it and add it to their hand. They return any remaining card to the top or bottom of their deck.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-023",
  printings: [
    {
      id: "EB01-023",
      artId: "EB01-023",
      setCode: "EB01",
      collectorNumber: "EB01-023",
      cardNumber: "EB01-023",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-023.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-023-p1",
      artId: "EB01-023_p1",
      setCode: "EB01",
      collectorNumber: "EB01-023-p1",
      cardNumber: "EB01-023",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-023_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-023",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-023.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 3,
  linkCondition: "[Asuna Elmarit]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Attack】All players each look at the top card of their deck. If it is a card that is Lv.5 or higher, they may reveal it and add it to their hand. They return any remaining card to the top or bottom of their deck.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "all",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "lookAtTopDeck",
                    count: 1,
                    return: "chooseTop",
                    tutorFilter: {
                      owner: "friendly",
                      count: 1,
                      attributeFilters: [{ attribute: "level", comparison: "gte", value: 5 }],
                    },
                  },
                },
              ],
              sourceText:
                "Look at the top card of your deck. You may reveal it and add it to your hand. Return it to the top or bottom of your deck.",
            },
          },
        },
      ],
      sourceText:
        "【Attack】All players each look at the top card of their deck. If it is a card that is Lv.5 or higher, they may reveal it and add it to their hand. They return any remaining card to the top or bottom of their deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
