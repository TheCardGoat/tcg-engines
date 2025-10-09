import type { UnitCardDefinition } from "../../card-types";

export const Cagalli039sSkygrasper: UnitCardDefinition = {
  id: "gd01-080",
  name: "Cagalli&#039;s Skygrasper",
  cardNumber: "GD01-080",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 2,
  cost: 2,
  text: "【Destroyed】Choose 1 enemy Unit that is Lv.2 or lower. Return it to its owner&#039;s hand.
",
  imageUrl: "../images/cards/card/GD01-080.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 2,
  hp: 1,
  zones: [
    "earth",
  ],
  traits: [
    "earth",
    "alliance",
  ],
  linkRequirements: [
    "cagalli-yula-athha",
  ],
  abilities: [
    {
      trigger: "ON_DESTROY",
      description: "【Destroyed】 Choose 1 enemy Unit that is Lv.2 or lower. Return it to its owner&#039;s hand.",
      effect: {
        type: "UNKNOWN",
        rawText: "Choose 1 enemy Unit that is Lv.2 or lower. Return it to its owner&#039;s hand.",
      },
    },
  ],
};
