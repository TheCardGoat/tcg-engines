import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hiddenCoveTranquilHaven: LorcanaLocationCardDefinition = {
  id: "s5s",
  reprints: ["sxr"],
  name: "Hidden Cove",
  title: "Tranquil Haven",
  characteristics: ["location"],
  text: "**REVITALIZING WATERS** Characters get +1 {S} and +1 {W} while here.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Revitalizing Waters",
      text: "Characters get +1 {S}",
      ability: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "attribute",
            attribute: "strength",
            amount: 1,
            modifier: "add",
            duration: "static",
            target: {
              type: "card",
              value: "all",
              filters: [{ filter: "source", value: "self" }],
            },
          },
          {
            type: "attribute",
            attribute: "willpower",
            amount: 1,
            modifier: "add",
            duration: "static",
            target: {
              type: "card",
              value: "all",
              filters: [{ filter: "source", value: "self" }],
            },
          },
        ],
      },
    }),
  ],
  flavour: "Flounder, this is perfect! I can't wait to explore it. \n−Ariel",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  moveCost: 1,
  willpower: 6,
  illustrator: "Roberto Gatto",
  number: 101,
  set: "URR",
  rarity: "common",
};
