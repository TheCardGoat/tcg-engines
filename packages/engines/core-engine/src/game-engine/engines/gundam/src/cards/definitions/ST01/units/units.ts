import type { GundamitoUnitCard } from "../../cardTypes";

export const gundamRx782: GundamitoUnitCard = {
  id: "ST01-001",
  implemented: false,
  cost: 3,
  level: 4,
  name: "Gundam | RX-78-2",
  type: "unit",
  linkRequirement: ["amuro Ray"],
  abilities: [
    {
      type: "static",
      name: "Repair 2",
      abilityType: "repair",
      text: "At end of your turn this unit recovers the specified number of HP.",
      value: 2,
    },
    {
      type: "when-paired",
      name: "During Pair",
      effects: [],
      text: "During your turn, all your Units get AP+1.",
    },
  ],
  traits: ["earth federation", "white base team"],
  zones: ["space", "earth"],
  ap: 3,
  hp: 4,
  rarity: "common",
  color: "blue",
  number: 1,
  set: "ST01",
};

export const gmRgm79: GundamitoUnitCard = {
  id: "ST01-005",
  implemented: false,
  cost: 1,
  level: 2,
  name: "GM | RGM-79",
  type: "unit",
  linkRequirement: [],
  abilities: [],
  traits: ["earth federation"],
  zones: ["space", "earth"],
  ap: 2,
  hp: 2,
  rarity: "common",
  color: "blue",
  number: 5,
  set: "ST01",
};

export const demiTrainer: GundamitoUnitCard = {
  id: "ST01-008",
  implemented: false,
  cost: 1,
  level: 1,
  name: "Demi Trainer",
  title: "MSJ-121",
  type: "unit",
  linkRequirement: [],
  abilities: [
    {
      type: "static",
      name: "Blocker",
      abilityType: "blocker",
      text: "Rest this Unit to change the attack target to it.",
    },
  ],
  traits: ["academy"],
  zones: ["space", "earth"],
  ap: 1,
  hp: 1,
  rarity: "common",
  color: "white",
  number: 8,
  set: "ST01",
};

export const gundamAerialBitOnFormXVX016: GundamitoUnitCard = {
  id: "ST01-007",
  implemented: true,
  cost: 2,
  level: 4,
  number: 7,
  type: "unit",
  name: "Gundam Aerial (Bit on Form) | XVX-016",
  color: "white",
  set: "ST01",
  rarity: "common",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["suletta mercury"],
  ap: 3,
  hp: 4,
  abilities: [],
};
