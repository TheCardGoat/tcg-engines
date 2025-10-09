import type { UnitCardDefinition } from "../../card-types";

export const GundamBarbatos4thForm: UnitCardDefinition = {
  id: "st05-001",
  name: "Gundam Barbatos 4th Form",
  cardNumber: "ST05-001",
  setCode: "ST05",
  cardType: "UNIT",
  rarity: "legendary",
  level: 6,
  cost: 4,
  text: "【Deploy】Choose 1 of your other Units. Deal 1 damage to it. It gets AP+1 during this turn.
While this is damaged, it gains &lt;Suppression&gt;.<br />
(Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)
",
  imageUrl: "../images/cards/card/ST05-001.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: 4,
  hp: 5,
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
    "mikazuki-augus",
  ],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】 Choose 1 of your other Units. Deal 1 damage to it. It gets AP+1 during this turn. While this is damaged, it gains <Suppression>.<br /> (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)",
      effect: {
        type: "DAMAGE",
        amount: 1,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
