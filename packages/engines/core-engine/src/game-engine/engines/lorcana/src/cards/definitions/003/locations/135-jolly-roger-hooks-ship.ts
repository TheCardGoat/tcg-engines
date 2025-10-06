import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import {
  gainAbilityWhileHere,
  rushAbility,
} from "~/game-engine/engines/lorcana/src/abilities";

export const jollyRogerHooksShip: LorcanaLocationCardDefinition = {
  id: "g68",
  type: "location",
  name: "Jolly Roger",
  title: "Hook's Ship",
  characteristics: ["location"],
  text: "**LOOK ALIVE, YOU SWABS!** Characters gain **Rush** while here. _(They can challenge the turn they're played.)_\n\n\n**ALL HANDS ON DECK!** Your Pirate characters may move here for free.",
  movementDiscounts: [
    {
      filters: [{ filter: "characteristics", value: ["pirate"] }],
      amount: 0,
    },
  ],
  abilities: [
    gainAbilityWhileHere({
      name: "LOOK ALIVE, YOU SWABS!",
      text: "Characters gain **Rush** while here. _(They can challenge the turn they're played.)_",
      ability: rushAbility,
    }),
    gainAbilityWhileHere({
      name: "ALL HANDS ON DECK!",
      text: "Your Pirate characters may move here for free.",
      ability: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "attribute",
            attribute: "moveCost",
            amount: 0,
            modifier: "add",
            target: {
              type: "card",
              value: "all",
              filters: [
                { filter: "source", value: "self" },
                { filter: "characteristics", value: ["pirate"] },
              ],
            },
          },
        ],
      },
    }),
  ],
  colors: ["ruby"],
  cost: 1,
  willpower: 5,
  lore: 0,
  moveCost: 2,
  illustrator: "Nicolas Ky",
  number: 135,
  set: "ITI",
  rarity: "uncommon",
};
