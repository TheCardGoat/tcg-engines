import type { UnitCardDefinition } from "@tcg/gundam-types";

export const DuelGundam: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-054",
  cardType: "UNIT",
  color: "red",
  cost: 2,
  hp: 3,
  id: "gd01-054",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-054.webp?26013001",
  level: 3,
  linkRequirements: ["(zaft)-trait"],
  name: "Duel Gundam",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "While this Unit has 5 or more AP, it gains <Breach 3>.\n\n(When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  traits: ["zaft"],
  zones: ["space", "earth"],
};
