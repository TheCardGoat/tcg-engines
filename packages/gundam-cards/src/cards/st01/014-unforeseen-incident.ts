import type { CommandCardDefinition } from "@tcg/gundam-types";

export const UnforeseenIncident: CommandCardDefinition = {
  id: "st01-014",
  name: "Unforeseen Incident",
  cardNumber: "ST01-014",
  setCode: "ST01",
  cardType: "COMMAND",
  rarity: "common",
  color: "white",
  level: 3,
  cost: 1,
  text: "【Burst】Activate this card's 【Main】.\n【Main】/【Action】Choose 1 enemy Unit. It gets AP-3 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-014.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  timing: "MAIN",
  effects: [
    {
      id: "eff-rjxdn5zir",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Activate this card's",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "Activate this card's",
      },
    },
    {
      id: "eff-mrtj2ysii",
      type: "CONSTANT",
      description: ".",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: ".",
      },
    },
    {
      id: "eff-14n76k9eb",
      type: "CONSTANT",
      description: "Choose 1 enemy Unit. It gets AP-3 during this turn.",
      restrictions: [],
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
  ],
};
