import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const geniePowerUnleashed: LorcanaCharacterCardDefinition = {
  id: "dgz",
  name: "Genie",
  title: "Powers Unleashed",
  characteristics: ["hero", "floodborn"],
  text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Genie._)\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHENOMENAL COSMIC POWER** Whenever this character quests, you may play an action with cost 5 or less for free.",
  type: "character",
  illustrator: "Javier Salas",
  abilities: [
    wheneverQuests({
      name: "Phenomenal Cosmic Power",
      text: "Whenever this character quests, you may play an action with cost 5 or less for free.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "play",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
              { filter: "type", value: "action" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 5 },
              },
            ],
          },
        },
      ],
    }),
    evasiveAbility,
    shiftAbility(6, "Genie"),
  ],
  colors: ["emerald"],
  cost: 8,
  strength: 3,
  willpower: 5,
  lore: 3,
  number: 76,
  set: "TFC",
  rarity: "rare",
};
