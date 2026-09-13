import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01BuildStrikeGundamFullPackageEx021: UnitCard = {
  cardNumber: "EB01-021",
  name: "Build Strike Gundam (Full Package) (EX)",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-021",
  canonicalId: "EB01-021",
  externalIds: { bandai: "gundam:eb01-021" },
  slug: "build-strike-gundam-full-package-ex-eb01-021",
  displayName: "Build Strike Gundam (Full Package) (EX)",
  rulesText:
    "<Breach 4> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【When Paired･(G Generation) Pilot】If there are 2 or more (G Generation) Unit cards in your trash, place 1 rested Resource.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-021",
  printings: [
    {
      id: "EB01-021",
      artId: "EB01-021",
      setCode: "EB01",
      collectorNumber: "EB01-021",
      cardNumber: "EB01-021",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-021.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-021-p1",
      artId: "EB01-021_p1",
      setCode: "EB01",
      collectorNumber: "EB01-021-p1",
      cardNumber: "EB01-021",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-021_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-021",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-021.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Reiji]",
  battlefieldZones: ["space", "earth"],
  effect:
    "<Breach 4> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【When Paired･(G Generation) Pilot】If there are 2 or more (G Generation) Unit cards in your trash, place 1 rested Resource.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "g generation",
        },
      },
      directives: [
        {
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            cardType: "unit",
            comparison: "gte",
            count: 2,
            hasTrait: "g generation",
          },
          thenDirectives: [
            {
              action: {
                action: "placeResource",
                state: "rested",
              },
            },
          ],
        },
      ],
      sourceText:
        "【When Paired·(G Generation) Pilot】If there are 2 or more (G Generation) Unit cards in your trash, place 1 rested Resource.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 4 }],
  rarity: "legendRare",
};
