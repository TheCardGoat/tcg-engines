import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st10PhoenixGundamPowerUnleashedEx006: UnitCard = {
  cardNumber: "ST10-006",
  name: "Phoenix Gundam (Power Unleashed) (EX)",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "ST10-006",
  canonicalId: "ST10-006",
  externalIds: { bandai: "gundam:st10-006" },
  slug: "phoenix-gundam-power-unleashed-ex-st10-006",
  displayName: "Phoenix Gundam (Power Unleashed) (EX)",
  rulesText:
    "【During Pair】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "ST10-006",
  printings: [
    {
      id: "ST10-006",
      artId: "ST10-006",
      setCode: "ST10",
      collectorNumber: "ST10-006",
      cardNumber: "ST10-006",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-006.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-006-p1",
      artId: "ST10-006_p1",
      setCode: "ST10",
      collectorNumber: "ST10-006-p1",
      cardNumber: "ST10-006",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-006_p1.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-006-p2",
      artId: "ST10-006_p2",
      setCode: "EB01",
      collectorNumber: "ST10-006-p2",
      cardNumber: "ST10-006",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-006_p2.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "ST10-006",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-006.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  linkCondition: "[Mark Guilder]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【During Pair】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onDestroyByBattle"],
        conditions: [
          {
            type: "duringPair",
          },
          {
            type: "isTurn",
            whose: "friendly",
          },
          {
            type: "eventCardIsSelf",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Pair】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
export const eb01PhoenixGundamPowerUnleashedEx006 = st10PhoenixGundamPowerUnleashedEx006;
