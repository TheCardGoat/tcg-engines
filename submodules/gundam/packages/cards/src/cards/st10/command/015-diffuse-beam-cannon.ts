import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st10DiffuseBeamCannon015: CommandCard = {
  cardNumber: "ST10-015",
  name: "Diffuse Beam Cannon",
  type: "command",
  color: "white",
  traits: ["g generation", "durability"],
  id: "ST10-015",
  canonicalId: "ST10-015",
  externalIds: { bandai: "gundam:st10-015" },
  slug: "diffuse-beam-cannon-st10-015",
  displayName: "Diffuse Beam Cannon",
  rulesText:
    "【Action】If a friendly (G Generation) Unit is in play, choose 1 enemy Unit. It gets AP-3 during this battle.\n【Pilot】[Claire Heathrow]",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "ST10-015",
  printings: [
    {
      id: "ST10-015",
      artId: "ST10-015",
      setCode: "ST10",
      collectorNumber: "ST10-015",
      cardNumber: "ST10-015",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-015.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-015-p1",
      artId: "ST10-015_p1",
      setCode: "ST10",
      collectorNumber: "ST10-015-p1",
      cardNumber: "ST10-015",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-015_p1.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "ST10-015",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-015.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  pilotName: "Claire Heathrow",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Action】If a friendly (G Generation) Unit is in play, choose 1 enemy Unit. It gets AP-3 during this battle.\n【Pilot】[Claire Heathrow]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "g generation",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -3,
            duration: "thisBattle",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】If a friendly (G Generation) Unit is in play, choose 1 enemy Unit. It gets AP-3 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
