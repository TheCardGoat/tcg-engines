import type { PilotCardDefinition } from "../../card-types";

export const M039quve: PilotCardDefinition = {
  id: "gd01-092",
  name: "M&#039;Quve",
  cardNumber: "GD01-092",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "common",
  color: "green",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.
While this Unit is (Zeon), it gains &lt;Breach 1&gt;.<br />
(When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)
",
  imageUrl: "../images/cards/card/GD01-092.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  traits: [
    "zeon",
  ],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Add this card to your hand. While this Unit is (Zeon), it gains <Breach 1>.<br /> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
      effect: {
        type: "UNKNOWN",
        rawText: "Add this card to your hand. While this Unit is (Zeon), it gains <Breach 1>.<br /> (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
      },
    },
  ],
};
