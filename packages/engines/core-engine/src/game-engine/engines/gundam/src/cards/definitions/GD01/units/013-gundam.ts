import type { GundamitoUnitCard } from "../../cardTypes";

export const gundam: GundamitoUnitCard = {
  id: "GD01-013",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 13,
  name: "Gundam",
  color: "blue",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-013.webp?250711",
  imgAlt: "Gundam",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["amuro ray"],
  ap: 3,
  hp: 4,
  abilities: [],
  text: "",
};
