import type { CommandCardDefinition } from "@tcg/gundam-types";

export const TheMagicBulletOfDusk: CommandCardDefinition = {
  cardNumber: "ST04-014",
  cardType: "COMMAND",
  color: "red",
  cost: 1,
  id: "st04-014",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-014.webp?26013001",
  level: 3,
  name: "The Magic Bullet of Dusk",
  pilotProperties: {
    apModifier: 0,
    hpModifier: 1,
    name: "Miguel Ayman",
    traits: ["zaft", "coordinator"],
  },
  rarity: "common",
  setCode: "ST04",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Main】/【Action】Choose 1 friendly Unit that is Lv.2 or lower. It gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)\n【Pilot】[Miguel Ayman]",
  timing: "MAIN",
};
