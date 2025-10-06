import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { madameMimAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const madamMimElephant: LorcanitoCharacterCardDefinition = {
  id: "txu",
  missingTestCase: true,
  name: "Madam Mim",
  title: "Elephant",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**A LITTLE GAME** When you play this character, banish her or return another chosen character of yours to your hand.\n\n **SNEAKY MOVE** At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.",
  type: "character",
  abilities: [
    {
      ...madameMimAbility,
      name: "A little game",
    },
    atTheStartOfYourTurn({
      name: "Sneaky Move",
      text: "At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.",
      optional: true,
      effects: [
        moveDamageEffect({
          amount: 2,
          from: thisCharacter,
          to: chosenOpposingCharacter,
        }),
      ],
      conditions: [
        {
          type: "filter",
          filters: [
            ...thisCharacter.filters,
            {
              filter: "status",
              value: "damage",
              comparison: { operator: "gte", value: 1 },
            },
          ],
          comparison: { operator: "gt", value: 0 },
        },
        {
          type: "filter",
          filters: [
            { filter: "type", value: "character" },
            { filter: "owner", value: "opponent" },
            { filter: "zone", value: "play" },
          ],
          comparison: { operator: "gte", value: 1 },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 7,
  lore: 1,
  illustrator: "Kenneth Anderson",
  number: 44,
  set: "SSK",
  rarity: "super_rare",
};
