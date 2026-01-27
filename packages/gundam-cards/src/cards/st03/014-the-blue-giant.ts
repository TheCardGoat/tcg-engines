import type { CommandCardDefinition } from "@tcg/gundam-types";

export const TheBlueGiant: CommandCardDefinition = {
  id: "st03-014",
  name: "The Blue Giant",
  cardNumber: "ST03-014",
  setCode: "ST03",
  cardType: "COMMAND",
  rarity: "common",
  color: "green",
  level: 4,
  cost: 1,
  text: "【Action】Choose 1 friendly Unit. It can't receive battle damage from enemy Units with 2 or less AP during this battle.\n【Pilot】[Ramba Ral]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-014.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  timing: "ACTION",
  pilotProperties: {
    name: "Ramba Ral",
    traits: ["zeon"],
    apModifier: 1,
    hpModifier: 1,
  },
  effects: [
    {
      id: "st03-014-effect-1",
      description:
        "【Action】Choose 1 friendly Unit. It can't receive battle damage from enemy Units with 2 or less AP during this battle. 【Pilot】[Ramba Ral]",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "【Action】Choose 1 friendly Unit. It can't receive battle damage from enemy Units with 2 or less AP during this battle. 【Pilot】[Ramba Ral]",
      },
    },
  ],
};
