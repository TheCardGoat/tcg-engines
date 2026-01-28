import type { UnitCardDefinition } from "@tcg/gundam-types";

export const SwordStrikeGundam: UnitCardDefinition = {
  id: "gd01-073",
  name: "Sword Strike Gundam",
  cardNumber: "GD01-073",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "white",
  level: 4,
  cost: 3,
  text: "【During Link】【Attack】Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-073.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 4,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "alliance"],
  linkRequirements: ["(earth-alliance)-trait"],
  effects: [
    {
      id: "eff-p8bq5tfdd",
      type: "TRIGGERED",
      timing: "ATTACK",
      description:
        "Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "hp",
              comparison: "lte",
              value: 2,
            },
          ],
        },
      },
    },
  ],
};
