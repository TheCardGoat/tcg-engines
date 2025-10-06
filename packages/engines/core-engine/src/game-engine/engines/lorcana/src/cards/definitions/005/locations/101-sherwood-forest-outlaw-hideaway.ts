import {
  gainAbilityWhileHere,
  wardAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sherwoodForestOutlawHideaway: LorcanaLocationCardDefinition = {
  id: "pi0",
  name: "Sherwood Forest",
  title: "Outlaw Hideaway",
  characteristics: ["location"],
  text: '**FOREST HOME** Your characters named Robin Hood may move here for free. **FAMILIAR TERRAIN** Characters gain **Ward** and "{E} ,1 {I} −Deal 2 damage to chosen damaged character" while here. _(Opponents can\'t choose them except to challenge.)_',
  type: "location",
  abilities: [
    // {
    //   name: "**FOREST HOME**",
    //   text: "Your characters named Robin Hood may move here for free.",
    //   TODO: This is currently done as an if condition inside the onMove function in the CharacterModel
    // },
    gainAbilityWhileHere({
      name: "Familiar Terrain",
      text: "Characters gain **Ward**",
      ability: wardAbility,
    }),
    gainAbilityWhileHere({
      name: "Familiar Terrain",
      text: "{E} – Deal 2 damage to chosen damaged character or location.",
      ability: {
        type: "activated",
        name: "Familiar Terrain",
        text: "{E} , 1 {I} − Deal 2 damage to chosen damaged character",
        costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
        effects: [
          {
            type: "damage",
            amount: 2,
            target: {
              type: "card",
              value: 1,
              filters: [
                { filter: "type", value: ["character"] },
                { filter: "zone", value: "play" },
                {
                  filter: "status",
                  value: "damage",
                  comparison: { operator: "gte", value: 1 },
                },
              ],
            },
          },
        ],
      },
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  willpower: 7,
  illustrator: "Douglas De La Hoz",
  number: 101,
  set: "SSK",
  rarity: "rare",
  moveCost: 2,
  movementDiscounts: [
    {
      filters: [
        {
          filter: "attribute",
          value: "name",
          comparison: { operator: "eq", value: "Robin Hood" },
        },
      ],
      amount: 0,
    },
  ],
};
