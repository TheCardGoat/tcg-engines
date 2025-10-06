import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beastHardheaded: LorcanaCharacterCardDefinition = {
  id: "sh5",
  name: "Beast",
  title: "Hardheaded",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**BREAK** When you play this character, you may banish chosen item card.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Break",
      text: "When you play this character, you may banish chosen item card.",
      optional: true,
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    }),
  ],
  flavour: '"She will never se me as anything... but a monster"',
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "Cookie",
  number: 172,
  set: "TFC",
  rarity: "uncommon",
};
