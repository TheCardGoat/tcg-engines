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
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Activate this card's 【Main】. 【Main】/【Action】Choose 1 enemy Unit. It gets AP-3 during this turn.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: -3,
        duration: "turn",
      },
    },
  ],
};
