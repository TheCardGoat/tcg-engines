import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";

export const theSorcerersTowerWondrousWorkspace: LorcanaLocationCardDefinition =
  {
    id: "sen",
    type: "location",
    missingTestCase: true,
    name: "The Sorcerer's Tower",
    title: "Wondrous Workspace",
    characteristics: ["location"],
    text: "**BROOM CLOSET** Your characters named Magic Broom may move here for free.\n\n\n**MAGICAL POWER** Characters get +1 {L} while here.",
    abilities: [
      // {
      //   name: "**BROOM CLOSET** Your characters named Magic Broom may move here for free.\n\n\n",
      // },
      gainAbilityWhileHere({
        name: "Magical Power",
        text: "Characters get +1 {L} while here.",
        ability: {
          type: "static",
          ability: "effects",
          effects: [
            {
              type: "attribute",
              attribute: "lore",
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
    flavour: "Everything you need to make some magic.",
    inkwell: true,
    colors: ["amethyst"],
    cost: 3,
    willpower: 7,
    lore: 0,
    moveCost: 2,
    movementDiscounts: [
      {
        filters: [
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "Magic Broom" },
          },
        ],
        amount: 0,
      },
    ],
    illustrator: "Wietse Treurniet",
    number: 68,
    set: "ITI",
    rarity: "uncommon",
  };
