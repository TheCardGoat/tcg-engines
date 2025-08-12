import {
  banishEffect,
  dealDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  chosenItemTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const touchedMyHeart: LorcanaActionCardDefinition = {
  id: "ee8",
  name: "Has Set My Heaaaaaaart ...",
  characteristics: ["action", "song"],
  text: "Banish chosen item.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish chosen item of yours to deal 5 damage to chosen character.",
      effects: [
        banishEffect({
          targets: [chosenItemTarget],
          followedBy: dealDamageEffect({
            targets: [chosenCharacterTarget],
            value: 5,
          }),
        }),
      ],
    },
  ],
  flavour:
    "He's not real smart, and yet, \nhe's touched my little cowhide heart.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Hyuna Lee",
  number: 94,
  set: "ITI",
  rarity: "uncommon",
};
