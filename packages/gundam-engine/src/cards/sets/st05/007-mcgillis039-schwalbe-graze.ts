import type { UnitCardDefinition } from "../../card-types";

export const Mcgillis039SchwalbeGraze: UnitCardDefinition = {
  id: "st05-007",
  name: "McGillis&#039; Schwalbe Graze",
  cardNumber: "ST05-007",
  setCode: "ST05",
  cardType: "UNIT",
  rarity: "legendary",
  color: "white",
  level: 4,
  cost: 3,
  text: "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)
【When Paired】Choose 1 enemy Unit that is Lv.3 or lower. It gets AP-2 during this turn.
",
  imageUrl: "../images/cards/card/ST05-007.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: 4,
  hp: 2,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "gjallarhorn",
  ],
  linkRequirements: [
    "mcgillis-fareed",
  ],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  abilities: [
    {
      trigger: "WHEN_PAIRED",
      description: "【When Paired】 Choose 1 enemy Unit that is Lv.3 or lower. It gets AP-2 during this turn.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: -2,
        duration: "turn",
      },
    },
  ],
};
