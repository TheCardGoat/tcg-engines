import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theQueensCastleMirrorChamber: LorcanaLocationCardDefinition = {
  id: "vbq",
  type: "location",
  name: "The Queen's Castle",
  title: "Mirror Chamber",
  characteristics: ["location"],
  text: "**USING THE MIRROR** At the start of your turn, for each character you have here, you may draw a card.",
  abilities: [
    atTheStartOfYourTurn({
      name: "Using the Mirror",
      text: "At the start of your turn, for each character you have here, you may draw a card.",
      optional: true,
      effects: [
        // TODO: this effect is not quite right, it's drawing X cards instead of creating X layers that draw 1 card each
        {
          type: "draw",
          amount: {
            dynamic: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "play" },
              { filter: "location", value: "source" },
            ],
          },
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    }),
  ],
  flavour:
    "Those who visit the mirror can choose their question−but not the answer.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  willpower: 7,
  lore: 2,
  moveCost: 1,
  illustrator: "Matthew Oates",
  number: 67,
  set: "ITI",
  rarity: "rare",
};
