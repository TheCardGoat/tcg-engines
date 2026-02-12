import type { UnitCardDefinition } from "@tcg/gundam-types";

export const ByarlantCustom: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-019",
  cardType: "UNIT",
  color: "blue",
  cost: 2,
  hp: 4,
  id: "gd01-019",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-019.webp?26013001",
  level: 4,
  linkRequirements: ["-"],
  name: "Byarlant Custom",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "While 4 or more enemy Units are in play, this Unit gains <Blocker>.\n\n(Rest this Unit to change the attack target to it.)",
  traits: ["earth", "federation"],
  zones: ["space", "earth"],
};
