// TODO: Once the set is released, we organize the cards by set and type

import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import {
  wheneverChallengesAnotherChar,
  wheneverPlays,
} from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mauiHalfshark: LorcanaCharacterCardDefinition = {
  id: "th4",
  missingTestCase: true,
  name: "Maui",
  title: "Half-Shark",
  characteristics: ["storyborn", "hero", "deity"],
  text: "Evasive (Only characters with Evasive can challenge this character.)\nCHEEEEOHOOOO! Whenever this character challenges another character, you may return an action card from your discard to your hand.\nWAYFINDING Whenever you play an action, gain 1 lore.",
  type: "character",
  abilities: [
    evasiveAbility,
    wheneverPlays({
      name: "Wayfinding",
      text: "Whenever you play an action, gain 1 lore.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "characteristics", value: ["action"] },
          { filter: "owner", value: "self" },
        ],
      },
      effects: [youGainLore(1)],
    }),
    wheneverChallengesAnotherChar({
      name: "Cheeeohoooo!",
      text: "Whenever this character challenges another character, you may return an action card from your discard to your hand.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: ["action"] },
              { filter: "zone", value: "discard" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 6,
  strength: 7,
  willpower: 5,
  lore: 1,
  illustrator: "Alexandria Neonakis",
  number: 124,
  set: "006",
  rarity: "legendary",
};
