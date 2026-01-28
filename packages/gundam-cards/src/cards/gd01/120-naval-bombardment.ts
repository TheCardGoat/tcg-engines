import type { CommandCardDefinition } from "@tcg/gundam-types";

export const NavalBombardment: CommandCardDefinition = {
  id: "gd01-120",
  name: "Naval Bombardment",
  cardNumber: "GD01-120",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "common",
  color: "white",
  level: 2,
  cost: 1,
  text: "【Burst】Choose 1 enemy Unit. It gets AP-3 during this turn.\n【Action】Choose 1 friendly Unit with <Blocker>. It gets AP+3 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-120.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "ACTION",
  effects: [
    {
      id: "eff-e99suiyxg",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Choose 1 enemy Unit. It gets AP-3 during this turn.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "MODIFY_STATS",
        attribute: "AP",
        value: -3,
        duration: "TURN",
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [],
        },
      },
    },
    {
      id: "eff-k9cgf1epz",
      type: "CONSTANT",
      description:
        "Choose 1 friendly Unit with . It gets AP+3 during this turn.",
      restrictions: [],
      conditions: [],
      action: {
        type: "MODIFY_STATS",
        attribute: "AP",
        value: 3,
        duration: "TURN",
        target: {
          controller: "SELF",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [],
        },
      },
    },
  ],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
};
