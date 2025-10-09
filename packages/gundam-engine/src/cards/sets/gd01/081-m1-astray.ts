import type { UnitCardDefinition } from "../../card-types";

export const M1Astray: UnitCardDefinition = {
  id: "gd01-081",
  name: "M1 Astray",
  cardNumber: "GD01-081",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 2,
  cost: 2,
  text: "While you have another (Triple Ship Alliance) Unit in play, this Unit gets AP+1 and &lt;Blocker&gt;.<br />
 (Rest this Unit to change the attack target to it.)
",
  imageUrl: "../images/cards/card/GD01-081.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 2,
  hp: 2,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "triple",
    "ship",
    "alliance",
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
      description: "While you have another (Triple Ship Alliance) Unit in play, this Unit gets AP+1 and <Blocker>.<br /> (Rest this Unit to change the attack target to it.)",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: 1,
        duration: "turn",
      },
    },
  ],
};
