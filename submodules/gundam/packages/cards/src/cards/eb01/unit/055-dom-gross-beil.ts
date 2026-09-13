import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01DomGrossBeil055: UnitCard = {
  cardNumber: "EB01-055",
  name: "Dom Gross Beil",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-055",
  canonicalId: "EB01-055",
  externalIds: { bandai: "gundam:eb01-055" },
  slug: "dom-gross-beil-eb01-055",
  displayName: "Dom Gross Beil",
  rulesText:
    "If there are 2 or more enemy players and this Unit is rested, friendly Shields can't receive battle damage from enemy Units.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-055",
  printings: [
    {
      id: "EB01-055",
      artId: "EB01-055",
      setCode: "EB01",
      collectorNumber: "EB01-055",
      cardNumber: "EB01-055",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-055.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-055",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-055.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  battlefieldZones: ["space", "earth"],
  effect:
    "If there are 2 or more enemy players and this Unit is rested, friendly Shields can't receive battle damage from enemy Units.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          { type: "enemyPlayerCount", comparison: "gte", count: 2 },
          { type: "selfIsRested" },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamageToZone",
            protectedArea: { kind: "zone", zone: "shieldArea" },
            unitFilter: { owner: "opponent", cardType: "unit" },
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "If there are 2 or more enemy players and this Unit is rested, friendly Shields can't receive battle damage from enemy Units.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
