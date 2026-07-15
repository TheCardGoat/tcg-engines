import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gfighter: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-009",
  cardType: "UNIT",
  color: "blue",
  cost: 2,
  hp: 2,
  id: "gd01-009",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-009.webp?26013001",
  level: 3,
  linkRequirements: ["(white-base-team)-trait"],
  name: "G-Fighter",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam",
  text: "【Deploy】Choose 1 of your (White Base Team) Units. It gains <High-Maneuver> during this turn.\n\n (This Unit can&#039;t be blocked.)",
  traits: ["earth", "federation", "white", "base", "team"],
  zones: ["space", "earth"],
};
