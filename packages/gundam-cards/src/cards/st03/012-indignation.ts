import type { CommandCardDefinition } from "@tcg/gundam-types";

export const Indignation: CommandCardDefinition = {
  id: "st03-012",
  name: "Indignation",
  cardNumber: "ST03-012",
  setCode: "ST03",
  cardType: "COMMAND",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 1,
  text: "【Main】/【Action】Choose 1 friendly Unit. It gets AP+2 during this turn.\n【Pilot】[Angelo Sauper]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-012.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  timing: "MAIN",
  pilotProperties: {
    name: "Angelo Sauper",
    traits: ["neo", "zeon"],
    apModifier: 1,
    hpModifier: 0,
  },
  effects: [
    {
      id: "eff-evy8n4q0d",
      type: "CONSTANT",
      description:
        "Choose 1 friendly Unit. It gets AP+2 during this turn. 【Pilot】[Angelo Sauper]",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "MODIFY_STATS",
            attribute: "AP",
            value: 2,
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
          {
            type: "CUSTOM",
            text: "【Pilot】[Angelo Sauper]",
          },
        ],
      },
    },
  ],
};
