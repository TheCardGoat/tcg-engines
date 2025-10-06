// TODO: Once the set is released, we organize the cards by set and type

import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tiggerInTheCrowsNest: LorcanaCharacterCardDefinition = {
  id: "vf2",
  name: "Tigger",
  title: "In the Crow's Nest",
  characteristics: ["hero", "storyborn", "pirate", "tigger"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**SWASH YOUR BUCKLES** Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
  type: "character",
  abilities: [
    evasiveAbility,
    wheneverPlays({
      name: "SWASH YOUR BUCKLES",
      text: "Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "characteristics", value: ["action"] },
          { filter: "owner", value: "self" },
        ],
      },
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          modifier: "add",
          amount: 1,
          duration: "turn",
          target: thisCharacter,
        },
        {
          type: "attribute",
          attribute: "lore",
          modifier: "add",
          amount: 1,
          duration: "turn",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 1,
  illustrator: "John Loren",
  number: 126,
  set: "006",
  rarity: "rare",
};
