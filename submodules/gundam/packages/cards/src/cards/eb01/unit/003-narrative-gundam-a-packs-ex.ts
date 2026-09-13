import type { UnitCard } from "@tcg/gundam-types";

export const eb01NarrativeGundamAPacksEx003: UnitCard = {
  cardNumber: "EB01-003",
  name: "Narrative Gundam A-Packs (EX)",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-003",
  canonicalId: "EB01-003",
  externalIds: { bandai: "gundam:eb01-003" },
  slug: "narrative-gundam-a-packs-ex-eb01-003",
  displayName: "Narrative Gundam A-Packs (EX)",
  rulesText:
    "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\nAt the end of your turn, if this Unit is rested, rest all Units. If this effect rested 3 or more Units, draw 1.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-003",
  printings: [
    {
      id: "EB01-003",
      artId: "EB01-003",
      setCode: "EB01",
      collectorNumber: "EB01-003",
      cardNumber: "EB01-003",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-003.webp",
      productName: "Eternal Nexus [EB01]",
    },
    {
      id: "EB01-003-p1",
      artId: "EB01-003_p1",
      setCode: "EB01",
      collectorNumber: "EB01-003-p1",
      cardNumber: "EB01-003",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-003_p1.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-003",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-003.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Jona Basta]",
  battlefieldZones: ["space"],
  effect:
    "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\nAt the end of your turn, if this Unit is rested, rest all Units. If this effect rested 3 or more Units, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["endOfTurn"], conditions: [{ type: "selfIsRested" }] },
      directives: [
        { action: { action: "rest", target: { owner: "any", cardType: "unit", count: "all" } } },
        {
          action: {
            action: "drawIfTargetMatches",
            count: 1,
            target: { owner: "any", cardType: "unit", count: 3 },
          },
        },
      ],
      sourceText:
        "At the end of your turn, if this Unit is rested, rest all Units. If this effect rested 3 or more Units, draw 1.",
    },
  ],
  keywordEffects: [{ keyword: "Repair", value: 2 }],
  rarity: "rare",
};
