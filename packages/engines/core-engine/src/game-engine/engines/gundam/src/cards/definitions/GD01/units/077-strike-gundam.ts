import type { GundamitoUnitCard } from "../../cardTypes";

export const strikeGundam: GundamitoUnitCard = {
  id: "GD01-077",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 77,
  name: "Strike Gundam",
  color: "white",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-077.webp?250711",
  imgAlt: "Strike Gundam",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["kira yamato"],
  ap: 3,
  hp: 4,
  abilities: [],
  text: "",
};
