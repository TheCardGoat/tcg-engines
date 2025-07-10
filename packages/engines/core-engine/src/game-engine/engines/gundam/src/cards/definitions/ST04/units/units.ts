import type { GundamitoUnitCard } from "../../cardTypes";

export const aileStrikeGundam: GundamitoUnitCard = {
  id: "ST04-001",
  implemented: true,
  cost: 4,
  level: 5,
  number: 1,
  type: "unit",
  name: "Aile Strike Gundam | GAT-X105+AQM/E-X01",
  color: "white",
  set: "ST04",
  rarity: "legendary",
  zones: ["space", "earth"],
  traits: ["earth alliance"],
  linkRequirement: ["kira yamato"],
  ap: 4,
  hp: 4,
  abilities: [],
};

export const strikeDaggerGAT1: GundamitoUnitCard = {
  id: "ST04-005",
  implemented: true,
  cost: 2,
  level: 2,
  number: 5,
  type: "unit",
  name: "Strike Dagger | GAT-01 ",
  color: "white",
  set: "ST04",
  rarity: "common",
  zones: ["space", "earth"],
  traits: ["earth alliance"],
  linkRequirement: [""],
  ap: 3,
  hp: 2,
  abilities: [],
};
