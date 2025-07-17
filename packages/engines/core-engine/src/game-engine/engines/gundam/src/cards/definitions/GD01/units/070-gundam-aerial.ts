import type { GundamitoUnitCard } from "../../cardTypes";

export const gundamAerial: GundamitoUnitCard = {
  id: "GD01-070",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 5,
  number: 70,
  name: "Gundam Aerial",
  color: "white",
  set: "GD01",
  rarity: "rare",
  imageUrl: "../images/cards/card/GD01-070.webp?250711",
  imgAlt: "Gundam Aerial",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["suletta mercury"],
  ap: 3,
  hp: 3,
  abilities: [],
  text: "While there are 4 or more Command cards in your trash, this card in your hand gets cost -2.",
};
