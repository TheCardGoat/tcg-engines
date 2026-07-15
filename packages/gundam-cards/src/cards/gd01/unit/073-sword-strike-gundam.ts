import type { UnitCardDefinition } from "@tcg/gundam-types";

export const SwordStrikeGundam: UnitCardDefinition = {
  ap: 4,
  cardNumber: "GD01-073",
  cardType: "UNIT",
  color: "white",
  cost: 3,
  hp: 3,
  id: "gd01-073",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-073.webp?26013001",
  level: 4,
  linkRequirements: ["(earth-alliance)-trait"],
  name: "Sword Strike Gundam",
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【During Link】【Attack】Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand.",
  traits: ["earth", "alliance"],
  zones: ["space", "earth"],
};
