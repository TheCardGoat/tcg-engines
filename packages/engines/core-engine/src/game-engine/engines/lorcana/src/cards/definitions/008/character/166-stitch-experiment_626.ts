import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { putTopCardOfOpponentDeckIntoTheirInkwell } from "~/game-engine/engines/lorcana/src/abilities/effect";
import {
  thisCard,
  thisCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stitchExperiment_626: LorcanaCharacterCardDefinition = {
  id: "fjv",
  name: "Stitch",
  title: "Experiment 626",
  characteristics: ["storyborn", "hero", "alien"],
  text: "SO NAUGHTY When you play this character, each opponent puts the top card of their deck into their inkwell.\nSTEALTH MODE At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play him for free and he enters play exerted.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "SO NAUGHTY",
      text: "When you play this character, each opponent puts the top card of their deck into their inkwell.",
      effects: [putTopCardOfOpponentDeckIntoTheirInkwell],
    }),
    atTheStartOfYourTurn({
      name: "STEALTH MODE",
      text: "At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play him for free and he enters play exerted.",
      optional: true,
      doesItTriggerFromDiscard: true,
      dependentEffects: true,
      conditions: [
        {
          type: "filter",
          filters: [...thisCard.filters, { filter: "zone", value: "discard" }],
          comparison: { operator: "eq", value: 1 },
        },
        {
          type: "filter",
          filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "hand" },
            { filter: "attribute", value: "inkwell", comparison: true },
          ],
          comparison: { operator: "gte", value: 1 },
        },
      ],
      effects: [
        {
          type: "discard",
          amount: 1,
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              target: thisCharacter,
              effects: [
                {
                  type: "play",
                  forFree: true,
                  exerted: true,
                  target: thisCard,
                },
              ],
            },
          ],
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
              { filter: "attribute", value: "inkwell", comparison: true },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "Matteo Marzocco",
  number: 166,
  set: "008",
  rarity: "legendary",
  lore: 2,
};
