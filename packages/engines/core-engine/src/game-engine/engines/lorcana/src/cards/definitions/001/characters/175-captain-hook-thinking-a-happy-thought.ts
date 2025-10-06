import {
  challengerAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const captainHookThinkingAHappyThought: LorcanaCharacterCardDefinition =
  {
    id: "s1b",

    name: "Captain Hook",
    title: "Thinking a Happy Thought",
    characteristics: ["floodborn", "villain", "pirate", "captain"],
    text: "**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)_\n\n**Challenger** +3 _(While challenging, this character gets +3 {S}.)_\n\n**STOLEN DUST** Characters with cost 3 or less can't challenge this character.",
    type: "character",
    illustrator: "Elliot Bocxtaele",
    abilities: [
      {
        type: "static",
        name: "Stolen Dust",
        text: "Characters with cost 3 or less can't challenge this character.",
        ability: "effects",
        effects: [
          {
            type: "protection",
            from: "challenge",
            target: {
              type: "card",
              value: "all",
              filters: [
                { filter: "type", value: "character" },
                { filter: "zone", value: "play" },
                {
                  filter: "attribute",
                  value: "cost",
                  comparison: { operator: "lte", value: 3 },
                },
              ],
            },
          },
        ],
      },
      challengerAbility(3),
      shiftAbility(3, "Captain Hook"),
    ],
    colors: ["steel"],
    cost: 5,
    strength: 2,
    willpower: 5,
    lore: 1,
    number: 175,
    set: "TFC",
    rarity: "rare",
  };
