import type { CommandCardDefinition } from "@tcg/gundam-types";

export const Rasid039sOrders: CommandCardDefinition = {
  id: "gd01-110",
  name: "Rasid&#039;s Orders",
  cardNumber: "GD01-110",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "common",
  color: "green",
  level: 3,
  cost: 1,
  text: "【Main】/【Action】Choose 1 Unit that is Lv.4 or higher. During this turn, it may choose an active enemy Unit with 6 or less AP as its attack target.\n【Pilot】[Rasid Kurama]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-110.webp?26013001",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "MAIN",
  pilotProperties: {
    name: "Rasid Kurama",
    traits: ["maganac", "corps"],
    apModifier: 0,
    hpModifier: 1,
  },
};
