import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { AbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const iagoLoudMouthedParrot: LorcanaCharacterCardDefinition = {
  id: "s1f",
  name: "Iago",
  title: "Loud-Mouthed Parrot",
  characteristics: ["storyborn", "ally"],
  text: "**YOU GOT A PROBLEM** {E} − Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "YOU GOT A PROBLEM?",
      text: "{E} − Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "ability",
          ability: "reckless",
          modifier: "add",
          duration: "next_turn",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
              { filter: "type", value: "character" },
            ],
          },
        } as AbilityEffect,
      ],
    } as ActivatedAbility,
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Brian Weisz",
  number: 80,
  set: "TFC",
  rarity: "rare",
};
