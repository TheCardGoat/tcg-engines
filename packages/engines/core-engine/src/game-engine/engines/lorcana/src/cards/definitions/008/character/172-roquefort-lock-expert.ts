import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const roquefortLockExpert: LorcanaCharacterCardDefinition = {
  id: "of1",
  name: "Roquefort",
  title: "Lock Expert",
  characteristics: ["storyborn", "ally"],
  text: "SAFEKEEPING Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.",
  type: "character",
  abilities: [
    wheneverThisCharacterQuests({
      name: "SAFEKEEPING",
      text: "Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
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
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Anderson Mahanski",
  number: 172,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
