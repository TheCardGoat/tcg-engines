import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GskyEasy: UnitCardDefinition = {
  ap: 1,
  cardNumber: "GD01-014",
  cardType: "UNIT",
  color: "blue",
  cost: 2,
  hp: 3,
  id: "gd01-014",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-014.webp?26013001",
  level: 3,
  linkRequirements: ["(white-base-team)-trait"],
  name: "G-Sky Easy",
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam",
  text: "【During Link】【Activate･Action】【Once per Turn】Choose 1 Unit. It recovers 1 HP.",
  traits: ["earth", "federation", "white", "base", "team"],
  zones: ["space", "earth"],
};
