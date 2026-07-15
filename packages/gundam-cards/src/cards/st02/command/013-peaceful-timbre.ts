import type { CommandCardDefinition } from "@tcg/gundam-types";

export const PeacefulTimbre: CommandCardDefinition = {
  cardNumber: "ST02-013",
  cardType: "COMMAND",
  color: "green",
  cost: 1,
  id: "st02-013",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-013.webp?26013001",
  level: 4,
  name: "Peaceful Timbre",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 1,
    name: "Quatre Raberba Winner",
    traits: ["operation", "meteor"],
  },
  rarity: "common",
  setCode: "ST02",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "【Action】During this battle, your shield area cards can't receive damage from enemy Units that are Lv.4 or lower.\n【Pilot】[Quatre Raberba Winner]",
  timing: "ACTION",
};
