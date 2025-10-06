import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { AbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scepterOfArendelle: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "ao2",

  name: "Scepter Of Arendelle",
  text: "**COMMAND** {E} − Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Command",
      text: "Chosen character gains **Support** this turn.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "ability",
          ability: "support",
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
            ],
          },
        } as AbilityEffect,
      ],
    } as ActivatedAbility,
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Grace Tran",
  number: 170,
  set: "TFC",
  rarity: "uncommon",
};
