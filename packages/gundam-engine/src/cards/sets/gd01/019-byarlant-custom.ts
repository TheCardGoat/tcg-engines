import type { UnitCardDefinition } from "../../card-types";

export const ByarlantCustom: UnitCardDefinition = {
  id: "gd01-019",
  name: "Byarlant Custom",
  cardNumber: "GD01-019",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "blue",
  level: 4,
  cost: 2,
  text: "While 4 or more enemy Units are in play, this Unit gains &lt;Blocker&gt;.<br />
(Rest this Unit to change the attack target to it.)
",
  imageUrl: "../images/cards/card/GD01-019.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 3,
  hp: 4,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "earth",
    "federation",
  ],
  linkRequirements: [
    "-",
  ],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  abilities: [
    {
      description: "While 4 or more enemy Units are in play, this Unit gains <Blocker>.<br /> (Rest this Unit to change the attack target to it.)",
      effect: {
        type: "UNKNOWN",
        rawText: "While 4 or more enemy Units are in play, this Unit gains <Blocker>.<br /> (Rest this Unit to change the attack target to it.)",
      },
    },
  ],
};
