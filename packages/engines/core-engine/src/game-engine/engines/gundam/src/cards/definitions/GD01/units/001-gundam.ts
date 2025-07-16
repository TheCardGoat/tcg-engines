import type { GundamitoUnitCard } from "../../cardTypes";

export const gundam: GundamitoUnitCard = {
  id: "GD01-001",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 1,
  name: "Gundam",
  color: "blue",
  set: "GD01",
  rarity: "legendary",
  imageUrl: "../images/cards/card/GD01-001.webp?250711",
  imgAlt: "Gundam",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["amuro ray"],
  ap: 3,
  hp: 3,
  abilities: [],
  text: "",
};
