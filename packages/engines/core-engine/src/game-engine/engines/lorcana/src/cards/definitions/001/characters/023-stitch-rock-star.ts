import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stitchRockStar: LorcanaCharacterCardDefinition = {
  id: "q0n",
  reprints: ["yom"],
  name: "Stitch",
  title: "Rock Star",
  characteristics: ["hero", "floodborn", "alien"],
  text: "**Shift** 4 (_You may pay 4 {I} to play this on top of one of your characters named Stitch._)/n**Adoring Fans** Whenever you play a character with cost 2 or less, you may exert them to draw a card.",
  type: "character",
  abilities: [
    wheneverPlays({
      name: "ADORING FANS",
      text: "Whenever you play a character with cost 2 or less, you may exert them to draw a card.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          {
            filter: "attribute",
            value: "cost",
            comparison: { operator: "lte", value: 2 },
          },
        ],
      },
      optional: true,
      effects: [
        {
          type: "exert",
          exert: true,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "trigger" }],
          },
        },
        {
          type: "draw",
          amount: 1,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    }),
    shiftAbility(4, "Stitch"),
  ],
  flavour:
    "The best part about a beachside concert is that there's always room for one more.",
  inkwell: true,
  colors: ["amber"],
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 3,
  illustrator: "Simangaliso Sibaya",
  number: 23,
  set: "TFC",
  rarity: "super_rare",
};
