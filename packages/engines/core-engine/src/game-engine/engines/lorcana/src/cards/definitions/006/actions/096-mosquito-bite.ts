import { putDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mosquitoBite: LorcanaActionCardDefinition = {
  id: "zw6",
  name: "Mosquito Bite",
  characteristics: ["action"],
  text: "Put 1 damage counter on chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Put 1 damage counter on chosen character.",
      targets: [chosenCharacterTarget],
      effects: [
        putDamageEffect({
          targets: [chosenCharacterTarget],
          value: 1,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Kamil Murzyn",
  number: 96,
  set: "006",
  rarity: "uncommon",
};
