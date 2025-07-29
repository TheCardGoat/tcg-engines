import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fireTheCannons: LorcanaActionCardDefinition = {
  id: "lhl",
  name: "Fire the Cannons!",
  characteristics: ["action"],
  text: "Deal 2 damage to chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal 2 damage to chosen character.",
      targets: [chosenCharacterTarget],
      effects: [dealDamageEffect({ value: 2 })],
    },
  ],
  flavour:
    "Captain Hook: „Double the powder and shorten the\rfuse!<br />Mr. Smee: „Shorten the powder and double the fuse!",
  colors: ["steel"],
  cost: 1,
  illustrator: "Matt Chapman",
  number: 197,
  set: "TFC",
  rarity: "common",
};
