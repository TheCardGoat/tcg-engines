import type { AbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicBroomIndustrialModel: LorcanaCharacterCardDefinition = {
  id: "ang",

  name: "Magic Broom",
  title: "Industrial Model",
  characteristics: ["dreamborn", "broom"],
  text: "**MAKE IT SHINE** When you play this character, chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Make it Shine",
      text: "When you play this character, chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
      effects: [
        {
          type: "ability",
          ability: "resist",
          amount: 1,
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  flavour:
    "Even with a hauling weight of seriously, a lot, it can only do so much in a magical flood.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Cristian Romero",
  number: 188,
  set: "ROF",
  rarity: "common",
};
