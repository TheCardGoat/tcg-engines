import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yenSidPowerfulSorcerer: LorcanaCharacterCardDefinition = {
  id: "hvf",
  name: "Yen Sid",
  title: "Powerful Sorcerer",
  characteristics: ["hero", "sorcerer", "storyborn"],
  text: "**TIMELY INTERVENTION** When you play this character, if you have a character named Magic Broom in play, you may draw a card.\n<br>\n**ARCANE STUDY** While you have 2 or more Broom characters in play, this character gets +2 {L}.",
  type: "character",
  abilities: [
    {
      name: "TIME INTERVENTION",
      text: "When you play this character, if you have a character named Magic Broom in play, you may draw a card.",
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
              comparison: { operator: "eq", value: "magic broom" },
            },
          ],
        },
      ],
      effects: [drawACard],
    },
    whileConditionThisCharacterGets({
      name: "ARCANE STUDY",
      text: "While you have 2 or more Broom characters in play, this character gets +2 {L}.",
      conditions: [
        {
          type: "filter",
          comparison: {
            operator: "gte",
            value: 2,
          },
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
            {
              filter: "attribute",
              value: "name",
              comparison: { operator: "eq", value: "magic broom" },
            },
          ],
        },
      ],
      // @ts-ignore
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 2,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Matthew Robert Davies",
  number: 59,
  set: "URR",
  rarity: "legendary",
};
