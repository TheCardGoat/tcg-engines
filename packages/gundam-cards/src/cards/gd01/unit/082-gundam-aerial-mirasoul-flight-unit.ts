import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamAerialMirasoulFlightUnit: UnitCardDefinition = {
  ap: 4,
  cardNumber: "GD01-082",
  cardType: "UNIT",
  color: "white",
  cost: 3,
  hp: 3,
  id: "gd01-082",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-082.webp?26013001",
  level: 4,
  linkRequirements: ["suletta-mercury"],
  name: "Gundam Aerial (Mirasoul Flight Unit)",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  text: "【During Pair】【Activate･Action】【Once per Turn】②：Choose 1 enemy Unit. It gets AP-1 during this battle.",
  traits: ["academy"],
  zones: ["space", "earth"],
};
