import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fairyGodmotherPureHeart: LorcanitoCharacterCardDefinition = {
  id: "e6p",

  name: "Fairy Godmother",
  title: "Pure Heart",
  characteristics: ["storyborn", "ally", "fairy"],
  text: "**JUST LEAVE IT TO ME** Whenever you play a character named Cinderella, you may exert chosen character.",
  type: "character",
  abilities: [
    wheneverPlays({
      name: "Just Leave It To Me",
      text: "Whenever you play a character named Cinderella, you may exert chosen character.",
      optional: true,
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "cinderella" },
          },
        ],
      },
      effects: [
        {
          type: "exert",
          exert: true,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  flavour: "We'll have to hurry, because even miracles take a little time.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Matt Chapman",
  number: 42,
  set: "ROF",
  rarity: "common",
};
