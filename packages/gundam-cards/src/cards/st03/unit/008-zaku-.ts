import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Zaku: UnitCardDefinition = {
  ap: 1,
  cardNumber: "ST03-008",
  cardType: "UNIT",
  color: "green",
  cost: 1,
  hp: 2,
  id: "st03-008",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-008.webp?26013001",
  level: 2,
  linkRequirements: ["-"],
  name: "Zaku Ⅱ",
  rarity: "common",
  setCode: "ST03",
  sourceTitle: "Mobile Suit Gundam",
  text: "【Attack】This Unit gets AP+2 during this turn.",
  traits: ["zeon"],
  zones: ["space", "earth"],
};
