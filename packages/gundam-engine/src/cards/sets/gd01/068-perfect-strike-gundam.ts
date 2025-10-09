import type { UnitCardDefinition } from "../../card-types";

export const PerfectStrikeGundam: UnitCardDefinition = {
  id: "gd01-068",
  name: "Perfect Strike Gundam",
  cardNumber: "GD01-068",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "white",
  level: 5,
  cost: 3,
  text: "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)
【Deploy】Choose 1 enemy Unit with 1 HP. Return it to its owner&#039;s hand.
",
  imageUrl: "../images/cards/card/GD01-068.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 4,
  hp: 4,
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
    "(earth-alliance)-trait",
  ],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】 Choose 1 enemy Unit with 1 HP. Return it to its owner&#039;s hand.",
      effect: {
        type: "UNKNOWN",
        rawText: "Choose 1 enemy Unit with 1 HP. Return it to its owner&#039;s hand.",
      },
    },
  ],
};
