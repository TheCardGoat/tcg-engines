import type { GundamitoUnitCard } from "../../cardTypes";

export const unicornGundamDestroyMode: GundamitoUnitCard = {
  id: "GD01-002",
  implemented: false,
  missingTestCase: true,
  cost: 6,
  level: 7,
  number: 2,
  name: "Unicorn Gundam (Destroy Mode)",
  color: "blue",
  set: "GD01",
  rarity: "legendary",
  imageUrl: "../images/cards/card/GD01-002.webp?250711",
  imgAlt: "Unicorn Gundam (Destroy Mode)",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["civilian"],
  linkRequirement: ["banagher links"],
  ap: 5,
  hp: 4,
  abilities: [],
  text: "When playing this card from your hand, you may destroy 1 of your Link Units with &quot;Unicorn Mode&quot; in its card name that is Lv.5. If you do, play this card as if it has 0 Lv. and cost.",
};
