import type { UnitCardDefinition } from "@tcg/gundam-types";

export const WingGundamZero: UnitCardDefinition = {
  ap: 5,
  cardNumber: "GD01-024",
  cardType: "UNIT",
  color: "green",
  cost: 8,
  hp: 7,
  id: "gd01-024",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-024.webp?26013001",
  keywords: [
    {
      keyword: "High-Maneuver",
    },
  ],
  level: 8,
  linkRequirements: ["heero-yuy"],
  name: "Wing Gundam Zero",
  rarity: "legendary",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "<High-Maneuver> (This Unit can&#039;t be blocked.)\n【Deploy】Deal 3 damage to all Units that are Lv.5 or lower.",
  traits: ["g", "team"],
  zones: ["space", "earth"],
};
