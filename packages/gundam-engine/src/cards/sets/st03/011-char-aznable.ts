import type { PilotCardDefinition } from "../../card-types";

export const CharAznable: PilotCardDefinition = {
  id: "st03-011",
  name: "Char Aznable",
  cardNumber: "ST03-011",
  setCode: "ST03",
  cardType: "PILOT",
  rarity: "common",
  color: "green",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.
【Attack】During this turn, this Unit gets AP+1 and, if it is a Link Unit, it gains &lt;High-Maneuver&gt;.<br />
(This Unit can't be blocked.)
",
  imageUrl: "../images/cards/card/ST03-011.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  traits: [
    "zeon",
    "newtype",
  ],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Add this card to your hand.",
      effect: {
        type: "UNKNOWN",
        rawText: "Add this card to your hand.",
      },
    },
    {
      trigger: "ON_ATTACK",
      description: "【Attack】 During this turn, this Unit gets AP+1 and, if it is a Link Unit, it gains <High-Maneuver>.<br /> (This Unit can't be blocked.)",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: 1,
        duration: "turn",
      },
    },
  ],
};
