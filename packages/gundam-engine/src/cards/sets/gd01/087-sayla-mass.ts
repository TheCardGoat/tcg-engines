import type { PilotCardDefinition } from "../../card-types";

export const SaylaMass: PilotCardDefinition = {
  id: "gd01-087",
  name: "Sayla Mass",
  cardNumber: "GD01-087",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "rare",
  color: "blue",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.
While this Unit is blue, it gains &lt;Repair 1&gt;.<br />
(At the end of your turn, this Unit recovers the specified number of HP.)
",
  imageUrl: "../images/cards/card/GD01-087.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  traits: [
    "earth",
    "federation",
    "white",
    "base",
    "team",
    "newtype",
  ],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Add this card to your hand. While this Unit is blue, it gains <Repair 1>.<br /> (At the end of your turn, this Unit recovers the specified number of HP.)",
      effect: {
        type: "UNKNOWN",
        rawText: "Add this card to your hand. While this Unit is blue, it gains <Repair 1>.<br /> (At the end of your turn, this Unit recovers the specified number of HP.)",
      },
    },
  ],
};
