import type { GundamitoCommandCardWithPilot } from "../../cardTypes";

export const peacefulTimbre: GundamitoCommandCardWithPilot = {
  id: "ST02-013",
  implemented: true,
  cost: 1,
  level: 4,
  name: "Peaceful Timbre",
  pilotName: "Quarte Raberba Winner",
  type: "command",
  subType: "pilot",
  abilities: [
    {
      type: "action",
      name: "Peaceful Timbre",
      text: "During this battle, your shield area cards can't receive damage from enemy Units that are Lv.4 or lower.",
      effects: [
        {
          type: "player-restriction",
          duration: 1,
          target: {
            type: "player",
            value: "self",
          },
          restriction: "shield-receive-damage",
          attackerFilters: [
            { filter: "zone", value: "battle" },
            { filter: "owner", value: "opponent" },
            { filter: "type", value: "unit" },
            {
              filter: "attribute",
              value: "level",
              comparison: { operator: "lte", value: 4 },
            },
          ],
        },
      ],
    },
  ],
  rarity: "common",
  color: "green",
  number: 13,
  set: "ST02",
  traits: ["operation meteor"],
  apModifier: 1,
  hpModifier: 1,
};

export const simultaneousFireTrowaBarton: GundamitoCommandCardWithPilot = {
  id: "ST02-012",
  implemented: true,
  cost: 1,
  level: 4,
  name: "Simultaneous Fire",
  pilotName: "Trowa Barton",
  type: "command",
  subType: "pilot",
  abilities: [
    // {
    //   type: "main",
    //   name: "Simultaneous Fire",
    //   text: "Choose 1 of your Units. It gains **Breach 3** during this turn.",
    //   effects: [
    //     {
    //       type: "modify",
    //       target: {
    //         type: "card",
    //         filters: [
    //           { filter: "owner", value: "self" },
    //           { filter: "type", value: "unit" },
    //         ],
    //       },
    //       attribute: "breach",
    //       value: 1,
    //     },
    //   ],
    // },
  ],
  rarity: "common",
  color: "green",
  number: 12,
  set: "ST02",
  traits: ["operation meteor"],
  apModifier: 1,
  hpModifier: 1,
};
