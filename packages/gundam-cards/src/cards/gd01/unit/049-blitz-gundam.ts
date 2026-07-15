import type { UnitCardDefinition } from "@tcg/gundam-types";

export const BlitzGundam: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-049",
  cardType: "UNIT",
  color: "red",
  cost: 3,
  hp: 3,
  id: "gd01-049",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-049.webp?26013001",
  level: 4,
  linkRequirements: ["nicol-amarfi"],
  name: "Blitz Gundam",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Deploy】Choose 1 of your (ZAFT) Units with 5 or more AP. It gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  traits: ["zaft"],
  zones: ["space", "earth"],
};
