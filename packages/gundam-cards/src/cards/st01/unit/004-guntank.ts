import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Guntank: UnitCardDefinition = {
  ap: 2,
  cardNumber: "ST01-004",
  cardType: "UNIT",
  color: "blue",
  cost: 2,
  hp: 3,
  id: "st01-004",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-004.webp?26013001",
  level: 3,
  linkRequirements: ["hayato-kobayashi"],
  name: "Guntank",
  rarity: "common",
  setCode: "ST01",
  sourceTitle: "Mobile Suit Gundam",
  text: "【Deploy】Choose 1 enemy Unit with 2 or less HP. Rest it.",
  traits: ["earth", "federation", "white", "base", "team"],
  zones: ["space", "earth"],
};
