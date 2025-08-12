import {
  gainLoreEffect,
  loseLoreEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import {
  eachOpponentTarget,
  youPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aPiratesLife: LorcanaActionCardDefinition = {
  id: "u5v",
  name: "A Pirate's Life",
  characteristics: ["action", "song"],
  text: "**Sing Together** 6 _(Any number of your of your teammates' characters with total cost 6 or more may {E} to sing this song for free.)_\n\n\nEach opponent loses 2 lore. You gain 2 lore.",
  type: "action",
  abilities: [
    singerTogetherAbility(6),
    {
      type: "static",
      text: "Each opponent loses 2 lore. You gain 2 lore.",
      effects: [
        loseLoreEffect({ value: 2, targets: [eachOpponentTarget] }),
        gainLoreEffect({ value: 2, targets: [youPlayerTarget] }),
      ],
    },
  ],
  flavour: "Give me a career\nAs a buccaneer",
  inkwell: true,
  colors: ["ruby"],
  cost: 6,
  illustrator: "Valentina Graziuso",
  number: 128,
  set: "URR",
  rarity: "uncommon",
};
