import type { CommandCardDefinition } from "../../card-types";

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
  text: "【Main】/【Action】Choose 1 friendly Unit. It gets AP+2 during this turn.
【Pilot】[Angelo Sauper]
",
  imageUrl: "../images/cards/card/ST03-012.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  timing: "MAIN",
  pilotProperties: {
    name: "Angelo Sauper",
    traits: [
      "neo",
      "zeon",
    ],
    apModifier: 1,
    hpModifier: 0,
  },
  abilities: [
    {
      description: "【Main】/【Action】Choose 1 friendly Unit. It gets AP+2 during this turn. 【Pilot】[Angelo Sauper]",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: 2,
        duration: "turn",
      },
    },
  ],
};
