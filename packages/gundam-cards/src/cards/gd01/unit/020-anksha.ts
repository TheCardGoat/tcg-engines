import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Anksha: UnitCardDefinition = {
  id: "gd01-020",
  name: "Anksha",
  cardNumber: "GD01-020",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 4,
  cost: 2,
  text: "【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-020.webp?26013001",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 3,
  hp: 3,
  zones: ["earth"],
  traits: ["earth", "federation"],
  linkRequirements: ["-"],
};
