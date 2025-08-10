import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const twinFire: LorcanaActionCardDefinition = {
  id: "c2j",
  name: "Twin Fire",
  characteristics: ["action"],
  text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal 2 damage to chosen character.",
      targets: [chosenCharacterTarget],
      effects: [dealDamageEffect({ value: 2 })],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  strength: 0,
  illustrator: "Taraneth",
  number: 197,
  set: "006",
  rarity: "common",
};
