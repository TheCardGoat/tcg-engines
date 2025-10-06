import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/target";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hadesFastTalker: LorcanaCharacterCardDefinition = {
  id: "ye4",
  name: "Hades",
  title: "Fast Talker",
  characteristics: ["storyborn", "villain", "deity"],
  text: "FOR JUST A LITTLE PAIN When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "FOR JUST A LITTLE PAIN",
      text: "When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.",
      optional: true,
      dependentEffects: true,
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "damage",
          amount: 2,
          target: chosenCharacterOfYours,
        },
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
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
    }),
  ],
  inkwell: false,
  colors: ["amethyst", "ruby"],
  cost: 6,
  strength: 4,
  willpower: 6,
  illustrator: "Cristian Romero",
  number: 52,
  set: "007",
  rarity: "rare",
  lore: 2,
};
