import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dragonFire: LorcanaActionCardDefinition = {
  id: "buy",
  name: "Dragon Fire",
  characteristics: ["action"],
  text: "Banish chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish chosen character.",
      targets: [chosenCharacterTarget],
      effects: [banishEffect()],
    },
  ],
  flavour: "Rare is the hero who can withstand a dragon's wrath.",
  colors: ["ruby"],
  cost: 5,
  illustrator: "Luis Huerta",
  number: 130,
  set: "TFC",
  rarity: "uncommon",
};
