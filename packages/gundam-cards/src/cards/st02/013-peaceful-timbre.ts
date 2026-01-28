import type { CommandCardDefinition } from "@tcg/gundam-types";

export const PeacefulTimbre: CommandCardDefinition = {
  id: "st02-013",
  name: "Peaceful Timbre",
  cardNumber: "ST02-013",
  setCode: "ST02",
  cardType: "COMMAND",
  rarity: "common",
  color: "green",
  level: 4,
  cost: 1,
  text: "【Action】During this battle, your shield area cards can't receive damage from enemy Units that are Lv.4 or lower.\n【Pilot】[Quatre Raberba Winner]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-013.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "ACTION",
  pilotProperties: {
    name: "Quatre Raberba Winner",
    traits: ["operation", "meteor"],
    apModifier: 1,
    hpModifier: 1,
  },
  effects: [
    {
      id: "eff-7hft41tbe",
      type: "CONSTANT",
      description:
        "During this battle, your shield area cards can't receive damage from enemy Units that are Lv.4 or lower. 【Pilot】[Quatre Raberba Winner]",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "During this battle, your shield area cards can't receive damage from enemy Units that are Lv.4 or lower. 【Pilot】[Quatre Raberba Winner]",
      },
    },
  ],
};
