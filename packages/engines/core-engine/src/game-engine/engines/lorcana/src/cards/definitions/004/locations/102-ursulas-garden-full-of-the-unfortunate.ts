import { allOpposingCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulasGardenFullOfTheUnfortunate: LorcanaLocationCardDefinition =
  {
    id: "bh5",
    name: "Ursula's Garden",
    title: "Full of the Unfortunate",
    characteristics: ["location"],
    text: "**Abandon Hope** While you have an exerted character here, opposing characters get -1 {L}.",
    type: "location",
    abilities: [
      {
        type: "static",
        ability: "effects",
        name: "Abandon Hope",
        text: "While you have an exerted character here, opposing characters get -1 {L}.",
        conditions: [
          {
            type: "chars-at-location",
            comparison: { operator: "gte", value: 1 },
            filters: [
              {
                filter: "status",
                value: "exerted",
              },
            ],
          },
        ],
        effects: [
          {
            type: "attribute",
            attribute: "lore",
            amount: 1,
            modifier: "subtract",
            duration: "static",
            target: allOpposingCharacters,
          },
        ],
      },
    ],
    inkwell: true,
    colors: ["emerald"],
    cost: 4,
    moveCost: 2,
    willpower: 7,
    lore: 1,
    illustrator: "Jonathan Livslyst",
    number: 102,
    set: "URR",
    rarity: "rare",
  };
