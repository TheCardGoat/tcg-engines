import type { GundamitoBaseCard, GundamitoResourceCard } from "../cardTypes";

// Rule 4-17-4-1: An EX Base is a Base token with 0 AP and 3 HP
// Rule 5-2-3: Each player places one active EX Base token card into the base section of their shield area
export const exBaseToken: GundamitoBaseCard = {
  id: "EX-BASE-TOKEN",
  type: "base",
  name: "EX Base",
  cost: 0, // Tokens have no cost but type requires it
  level: 0, // Tokens have no level but type requires it
  color: "blue", // Tokens have no color but type requires it - using blue as default
  number: 0,
  set: "GD01",
  rarity: "common",
  zones: ["space", "earth"], // EX Base can be placed in any zone
  traits: [],
  abilities: [],
  ap: 0, // Rule 4-17-4-1: 0 AP
  hp: 3, // Rule 4-17-4-1: 3 HP
  implemented: true,
};

// Rule 5-2-4: Player Two places one active EX Resource token card into their resource area
export const exResourceToken: GundamitoResourceCard = {
  id: "EX-RESOURCE-TOKEN",
  type: "resource",
  name: "EX Resource",
  number: 0,
  set: "GD01",
  rarity: "common",
  implemented: true,
};
