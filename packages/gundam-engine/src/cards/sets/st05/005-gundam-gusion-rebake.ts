import type { UnitCardDefinition } from "../../card-types";

export const GundamGusionRebake: UnitCardDefinition = {
  id: "st05-005",
  name: "Gundam Gusion Rebake",
  cardNumber: "ST05-005",
  setCode: "ST05",
  cardType: "UNIT",
  rarity: "common",
  level: 4,
  cost: 3,
  text: "【Destroyed】Choose 1 enemy Unit with 4 or less AP. Rest it.
",
  imageUrl: "../images/cards/card/ST05-005.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: 3,
  hp: 4,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "tekkadan",
    "gundam",
    "frame",
  ],
  linkRequirements: [
    "akihiro-altland",
  ],
  abilities: [
    {
      trigger: "ON_DESTROY",
      description: "【Destroyed】 Choose 1 enemy Unit with 4 or less AP. Rest it.",
      effect: {
        type: "UNKNOWN",
        rawText: "Choose 1 enemy Unit with 4 or less AP. Rest it.",
      },
    },
  ],
};
