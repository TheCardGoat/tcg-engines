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
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Choose 1 enemy Unit. It gets AP-3 during this turn. 【Action】Choose 1 friendly Unit with <Blocker>. It gets AP+3 during this turn.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: -3,
        duration: "turn",
      },
    },
  ],
};
