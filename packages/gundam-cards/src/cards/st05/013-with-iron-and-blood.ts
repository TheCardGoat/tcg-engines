import type { CommandCardDefinition } from "@tcg/gundam-types";

export const WithIronAndBlood: CommandCardDefinition = {
  id: "st05-013",
  name: "With Iron and Blood",
  cardNumber: "ST05-013",
  setCode: "ST05",
  cardType: "COMMAND",
  rarity: "common",
  level: 2,
  cost: 1,
  text: "【Main】/【Action】Choose 1 of your Units. Deal 1 damage to it. It gets AP+3 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-013.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  timing: "MAIN",
  effects: [
    {
      id: "eff-sv8w42b07",
      type: "CONSTANT",
      description:
        "Choose 1 of your Units. Deal 1 damage to it. It gets AP+3 during this turn.",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "DAMAGE",
            value: 1,
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
        ],
      },
    },
  ],
};
