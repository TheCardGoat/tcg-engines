import { whenYouPlayMayDrawACard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};

export const pawpsicle: LorcanaItemCardDefinition = {
  id: "qu5",
  name: "Pawpsicle",
  characteristics: ["item"],
  text: "**JUMBO POP** When you play this item, you may draw a card.\n\n**THAT'S REDWOOD** Banish this item − Remove up to 2 damage from chosen character.",
  type: "item",
  abilities: [
    {
      ...whenYouPlayMayDrawACard,
      name: "Jumbo Pop",
    },
    {
      type: "activated",
      name: "That's Redwood",
      text: "Banish this item − Remove up to 2 damage from chosen character.",
      optional: true,
      costs: [{ type: "banish" }],
      effects: [
        {
          type: "heal",
          amount: 2,
          target: chosenCharacter,
        },
      ],
    } as ActivatedAbility,
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Isaiah Mesq",
  number: 169,
  set: "ROF",
  rarity: "common",
};
