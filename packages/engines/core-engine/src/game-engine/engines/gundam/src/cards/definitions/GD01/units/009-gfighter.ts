import type { GundamitoUnitCard } from "../../cardTypes";

export const gfighter: GundamitoUnitCard = {
  id: "GD01-009",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 9,
  name: "G-Fighter",
  color: "blue",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-009.webp?250711",
  imgAlt: "G-Fighter",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(white base team) trait"],
  ap: 3,
  hp: 2,
  abilities: [],
  text: "",
};
