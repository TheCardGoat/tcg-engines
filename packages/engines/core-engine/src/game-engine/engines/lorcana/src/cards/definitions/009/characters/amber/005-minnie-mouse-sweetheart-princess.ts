import {
  supportAbility,
  yourCharactersNamedGain,
} from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseSweetheartPrincess: LorcanaCharacterCardDefinition = {
  id: "rcq",
  name: "Minnie Mouse",
  title: "Sweetheart Princess",
  characteristics: ["dreamborn", "hero", "princess"],
  text: "ROYAL FAVOR Your characters named Mickey Mouse gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)\nBYE BYE, NOW Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.",
  type: "character",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 4,
  illustrator: "Ellie Horie",
  number: 5,
  set: "009",
  rarity: "super_rare",
  abilities: [
    yourCharactersNamedGain({
      name: "Mickey Mouse",
      ability: supportAbility,
    }),
    wheneverThisCharacterQuests({
      name: "BYE BYE, NOW",
      text: "Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.",
      optional: true,
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "status", value: "exerted" },
              {
                filter: "attribute",
                value: "strength",
                comparison: { operator: "gte", value: 5 },
              },
            ],
          },
        },
      ],
    }),
  ],
  lore: 2,
};
