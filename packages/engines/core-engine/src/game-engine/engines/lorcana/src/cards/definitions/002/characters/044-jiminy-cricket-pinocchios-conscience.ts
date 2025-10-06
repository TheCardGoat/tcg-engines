import { drawACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jiminyCricketPinocchiosConscience: LorcanaCharacterCardDefinition =
  {
    id: "na1",

    name: "Jiminy Cricket",
    title: "Pinocchio's Conscience",
    characteristics: ["storyborn", "mentor"],
    text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**THAT STILL, SMALL VOICE** When you play this character, if you have a character named Pinocchio in play, you may draw a card.",
    type: "character",
    abilities: [
      evasiveAbility,
      {
        name: "THAT STILL, SMALL VOICE",
        text: "When you play this character, if you have a character named Pinocchio in play, you may draw a card",
        optional: true,
        type: "resolution",
        resolutionConditions: [
          {
            type: "filter",
            comparison: { operator: "gte", value: 1 },
            filters: [
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "pinocchio" },
              },
            ],
          },
        ],
        effects: [drawACard],
      },
    ],
    flavour: "Say, that's pretty swell.",
    inkwell: true,
    colors: ["amethyst"],
    cost: 2,
    strength: 1,
    willpower: 2,
    lore: 1,
    illustrator: "Isaiah Mesq",
    number: 44,
    set: "ROF",
    rarity: "common",
  };
