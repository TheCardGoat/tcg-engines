import {
  evasiveAbility,
  madameMimAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const madamMimPurpleDragon: LorcanitoCharacterCardDefinition = {
  id: "x3t",
  name: "Madam Mim",
  title: "Purple Dragon",
  characteristics: ["sorcerer", "storyborn", "villain", "dragon"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**I WIN, I WIN!** When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
  type: "character",
  abilities: [
    evasiveAbility,
    {
      ...madameMimAbility,
      name: "I win win",
      text: "When you play this character, banish her or return another 2 chosen characters of yours to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 2,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Did I say no purple dragons? Did I?",
  inkwell: true,
  colors: ["amethyst"],
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 4,
  illustrator: "Ally Zermeno",
  number: 47,
  set: "ROF",
  rarity: "legendary",
};
