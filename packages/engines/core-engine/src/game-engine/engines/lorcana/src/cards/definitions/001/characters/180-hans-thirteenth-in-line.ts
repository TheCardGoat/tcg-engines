import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hansThirteenthInLine: LorcanaCharacterCardDefinition = {
  id: "p2r",
  name: "Hans",
  title: "Thirteenth in Line",
  characteristics: ["storyborn", "villain", "prince"],
  text: "**STAGE LITTLE ACCIDENT** Whenever this character quests, you may deal 1 damage to chosen character.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "STAGE LITTLE ACCIDENT",
      text: "Whenever this character quests, you may deal 1 damage to chosen character.",
      optional: true,
      effects: [
        {
          type: "damage",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    }),
  ],
  flavour: "Tired of being last, he decided to cut the line.",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Kendall Hale",
  number: 180,
  set: "TFC",
  rarity: "super_rare",
};
