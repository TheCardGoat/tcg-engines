import type { PilotCardDefinition } from "../../card-types";

export const CagalliYulaAthha: PilotCardDefinition = {
  id: "gd01-096",
  name: "Cagalli Yula Athha",
  cardNumber: "GD01-096",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "rare",
  color: "white",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.
While this Unit is white, it gains &lt;Blocker&gt;.<br />
(Rest this Unit to change the attack target to it.)
",
  imageUrl: "../images/cards/card/GD01-096.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  traits: [
    "orb",
  ],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Add this card to your hand. While this Unit is white, it gains <Blocker>.<br /> (Rest this Unit to change the attack target to it.)",
      effect: {
        type: "UNKNOWN",
        rawText: "Add this card to your hand. While this Unit is white, it gains <Blocker>.<br /> (Rest this Unit to change the attack target to it.)",
      },
    },
  ],
};
