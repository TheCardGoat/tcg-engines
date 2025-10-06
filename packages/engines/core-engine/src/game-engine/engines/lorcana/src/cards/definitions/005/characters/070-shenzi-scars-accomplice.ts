import {
  challengerAbility,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
export const shenziScarsAccomplice: LorcanaCharacterCardDefinition = {
  id: "b08",
  missingTestCase: true,
  name: "Shenzi",
  title: "Scar's Accomplice",
  characteristics: ["storyborn", "ally", "hyena"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_ **EASY PICKINGS** While challenging a damaged character, this character gets +2 {S}.",
  type: "character",
  abilities: [
    evasiveAbility,
    wheneverChallengesAnotherChar({
      name: "EASY PICKINGS",
      text: "While challenging a damaged character, this character gets +2 {S}.",
      defenderFilter: [
        {
          filter: "type",
          value: "character",
        },
        {
          filter: "zone",
          value: "play",
        },
        {
          filter: "status",
          value: "damage",
          comparison: { operator: "gte", value: 1 },
        },
      ],
      effects: [
        {
          type: "ability",
          ability: "custom",
          customAbility: challengerAbility(2),
          modifier: "add",
          amount: 2,
          duration: "challenge",
          target: {
            type: "card",
            value: "all",
            filters: [
              {
                filter: "challenge",
                value: "attacker",
              },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Julien Vandois",
  number: 70,
  set: "SSK",
  rarity: "uncommon",
};
