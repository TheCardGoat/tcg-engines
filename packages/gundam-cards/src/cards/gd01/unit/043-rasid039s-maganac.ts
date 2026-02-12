import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Rasid039sMaganac: UnitCardDefinition = {
  ap: 2,
  cardNumber: "GD01-043",
  cardType: "UNIT",
  color: "green",
  cost: 2,
  hp: 3,
  id: "gd01-043",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-043.webp?26013001",
  level: 3,
  linkRequirements: ["(maganac-corps)-trait"],
  name: "Rasid&#039;s Maganac",
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "【Deploy】Choose 1 of your green Units. During this turn, it may choose an active enemy Unit with 4 or less AP as its attack target.",
  traits: ["maganac", "corps"],
  zones: ["space", "earth"],
};
