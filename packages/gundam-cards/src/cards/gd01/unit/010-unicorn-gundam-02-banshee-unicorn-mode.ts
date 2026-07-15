import type { UnitCardDefinition } from "@tcg/gundam-types";

export const UnicornGundam02BansheeUnicornMode: UnitCardDefinition = {
  ap: 4,
  cardNumber: "GD01-010",
  cardType: "UNIT",
  color: "blue",
  cost: 3,
  hp: 3,
  id: "gd01-010",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-010.webp?26013001",
  level: 4,
  linkRequirements: ["(cyber-newtype)-trait"],
  name: "Unicorn Gundam 02 Banshee (Unicorn Mode)",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "【When Paired】Choose 1 enemy Unit with 3 or less HP. Rest it.",
  traits: ["earth", "federation"],
  zones: ["space", "earth"],
};
