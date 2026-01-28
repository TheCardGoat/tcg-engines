import type { CommandCardDefinition } from "@tcg/gundam-types";

export const TheMagicBulletOfDusk: CommandCardDefinition = {
  id: "st04-014",
  name: "The Magic Bullet of Dusk",
  cardNumber: "ST04-014",
  setCode: "ST04",
  cardType: "COMMAND",
  rarity: "common",
  color: "red",
  level: 3,
  cost: 1,
  text: "【Main】/【Action】Choose 1 friendly Unit that is Lv.2 or lower. It gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)\n【Pilot】[Miguel Ayman]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-014.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  pilotProperties: {
    name: "Miguel Ayman",
    traits: ["zaft", "coordinator"],
    apModifier: 0,
    hpModifier: 1,
  },
  effects: [
    {
      id: "eff-q89ykxkv1",
      type: "CONSTANT",
      description: "/",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "/",
      },
    },
    {
      id: "eff-zl4e0j5i7",
      type: "CONSTANT",
      description:
        "Choose 1 friendly Unit that is Lv.2 or lower. It gains during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.) 【Pilot】[Miguel Ayman]",
      restrictions: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 0,
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
      keyword: "First-Strike",
    },
  ],
};
