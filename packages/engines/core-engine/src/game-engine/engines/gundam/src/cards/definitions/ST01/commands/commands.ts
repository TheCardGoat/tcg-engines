import { drawXCard } from "~/game-engine/engines/gundam/src/abilities/effects/effects";
import type {
  GundamitoCommandCard,
  GundamitoCommandCardWithPilot,
} from "~/game-engine/engines/gundam/src/cards/definitions/cardTypes";

export const aShowOfResolve: GundamitoCommandCard = {
  id: "ST01-100",
  implemented: true,
  cost: 3,
  level: 4,
  name: "A Show of Resolve",
  type: "command",
  abilities: [
    {
      type: "main",
      name: "A Show of Resolve",
      text: "Draw 2.",
      effects: [drawXCard(2)],
    },
  ],
  rarity: "rare",
  color: "blue",
  number: 100,
  set: "ST01",
};

export const kaisResolveKaiShiden: GundamitoCommandCardWithPilot = {
  id: "ST01-013",
  implemented: true,
  cost: 1,
  level: 3,
  name: "Kai's Resolve",
  pilotName: "Kai Shiden",
  type: "command",
  subType: "pilot",
  abilities: [
    {
      type: "main",
      name: "Kai's Resolve",
      text: "Choose 1 friendly Unit. It recovers 3 HP.",
      effects: [
        {
          type: "heal",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "unit" },
              { filter: "zone", value: "battle" },
            ],
          },
          amount: 3,
        },
      ],
    },
  ],
  rarity: "rare",
  color: "blue",
  number: 13,
  set: "ST01",
  traits: ["earth federation", "white base team"],
  apModifier: 1,
  hpModifier: 1,
};
