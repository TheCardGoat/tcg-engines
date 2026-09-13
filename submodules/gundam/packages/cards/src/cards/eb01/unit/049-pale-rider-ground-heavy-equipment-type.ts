import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01PaleRiderGroundHeavyEquipmentType049: UnitCard = {
  cardNumber: "EB01-049",
  name: "Pale Rider (Ground Heavy Equipment Type)",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-049",
  canonicalId: "EB01-049",
  externalIds: { bandai: "gundam:eb01-049" },
  slug: "pale-rider-ground-heavy-equipment-type-eb01-049",
  displayName: "Pale Rider (Ground Heavy Equipment Type)",
  rulesText:
    "While a friendly (G Generation) Unit with <Blocker> is in play, this Unit gains <Suppression>.\n\n(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-049",
  printings: [
    {
      id: "EB01-049",
      artId: "EB01-049",
      setCode: "EB01",
      collectorNumber: "EB01-049",
      cardNumber: "EB01-049",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-049.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-049",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-049.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 6,
  cost: 4,
  ap: 5,
  hp: 4,
  battlefieldZones: ["earth"],
  effect:
    "While a friendly (G Generation) Unit with <Blocker> is in play, this Unit gains <Suppression>.\n\n(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "g generation",
            hasKeyword: "Blocker",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Suppression",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While a friendly (G Generation) Unit with <Blocker> is in play, this Unit gains <Suppression>. (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
