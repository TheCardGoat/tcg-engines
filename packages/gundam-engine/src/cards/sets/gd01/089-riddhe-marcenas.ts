import type { PilotCardDefinition } from "../../card-types";

export const RiddheMarcenas: PilotCardDefinition = {
  id: "gd01-089",
  name: "Riddhe Marcenas",
  cardNumber: "GD01-089",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.
While this Unit has &lt;Repair&gt;, it gets AP+1.
",
  imageUrl: "../images/cards/card/GD01-089.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  traits: [
    "earth",
    "federation",
  ],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Add this card to your hand. While this Unit has <Repair>, it gets AP+1.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: 1,
        duration: "turn",
      },
    },
  ],
};
