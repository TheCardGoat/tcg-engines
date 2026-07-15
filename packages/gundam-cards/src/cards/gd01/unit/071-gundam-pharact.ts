import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamPharact: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-071",
  cardType: "UNIT",
  color: "white",
  cost: 3,
  hp: 4,
  id: "gd01-071",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-071.webp?26013001",
  level: 4,
  linkRequirements: ["(academy)-trait"],
  name: "Gundam Pharact",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  text: "【During Link】【Attack】Choose 1 enemy Unit. It gets AP-2 during this battle.",
  traits: ["academy"],
  zones: ["space", "earth"],
};
