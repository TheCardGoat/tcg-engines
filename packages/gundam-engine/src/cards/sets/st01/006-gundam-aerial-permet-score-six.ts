import type { UnitCardDefinition } from "../../card-types";

export const GundamAerialPermetScoreSix: UnitCardDefinition = {
  id: "st01-006",
  name: "Gundam Aerial (Permet Score Six)",
  cardNumber: "ST01-006",
  setCode: "ST01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "white",
  level: 5,
  cost: 4,
  text: "【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-3 during this turn.
",
  imageUrl: "../images/cards/card/ST01-006.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 4,
  hp: 4,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "academy",
  ],
  linkRequirements: [
    "suletta-mercury",
  ],
  abilities: [
    {
      trigger: "WHEN_PAIRED",
      description: "【When Paired】 Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-3 during this turn.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: -3,
        duration: "turn",
      },
    },
  ],
};
