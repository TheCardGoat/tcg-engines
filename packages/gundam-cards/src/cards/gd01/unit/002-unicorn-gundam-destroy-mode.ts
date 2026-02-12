import type { UnitCardDefinition } from "@tcg/gundam-types";

export const UnicornGundamDestroyMode: UnitCardDefinition = {
  ap: 5,
  cardNumber: "GD01-002",
  cardType: "UNIT",
  color: "blue",
  cost: 6,
  hp: 4,
  id: "gd01-002",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-002.webp?26013001",
  level: 7,
  linkRequirements: ["banagher-links"],
  name: "Unicorn Gundam (Destroy Mode)",
  rarity: "legendary",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: 'When playing this card from your hand, you may destroy 1 of your Link Units with "Unicorn Mode" in its card name that is Lv.5. If you do, play this card as if it has 0 Lv. and cost.\n【Attack】Choose 1 enemy Unit. Rest it.',
  traits: ["civilian"],
  zones: ["space", "earth"],
};
