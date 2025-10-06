import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const boltHeadstrongDog: LorcanaCharacterCardDefinition = {
  id: "g7i",
  name: "Bolt",
  title: "Headstrong Dog",
  characteristics: ["storyborn", "hero"],
  text: "THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.",
  type: "character",
  abilities: [
    wheneverQuests({
      ...youMayDrawThenChooseAndDiscard,
      name: "THERE'S NO TURNING BACK",
      text: "Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.",
      conditions: [
        {
          type: "filter",
          filters: [
            { filter: "source", value: "self" },
            {
              filter: "status",
              value: "damage",
              comparison: { operator: "eq", value: 0 },
            },
          ],
          comparison: { operator: "gte", value: 1 },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 1,
  willpower: 3,
  illustrator: "Brian Weisz",
  number: 184,
  set: "007",
  rarity: "common",
  lore: 1,
};
