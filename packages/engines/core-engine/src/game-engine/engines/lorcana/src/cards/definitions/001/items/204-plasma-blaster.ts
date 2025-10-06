import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { CardEffectTarget } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

const quickShot: ActivatedAbility = {
  type: "activated",
  name: "Quick Shot",
  text: "Deal 1 damage to chosen character.",
  optional: false,
  effects: [
    {
      type: "damage",
      amount: 1,
      target: chosenCharacter,
    },
  ],
  costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
};

export const plasmaBlaster: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "t4y",
  name: "Plasma Blaster",
  text: "**QUICK SHOT** {E}, 2 {I} − Deal 1 damage to chosen character.",
  type: "item",
  abilities: [quickShot],
  flavour:
    "You don't have to say 'pew pew' when you use it, but it doesn't hurt. \n−Lilo, galactic hero",
  colors: ["steel"],
  cost: 3,
  number: 204,
  set: "TFC",
  rarity: "rare",
  illustrator: "TBD",
};
