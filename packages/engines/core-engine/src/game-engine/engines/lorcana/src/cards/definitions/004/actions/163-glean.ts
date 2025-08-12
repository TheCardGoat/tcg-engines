import {
  banishEffect,
  gainLoreEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenItemTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { targetOwnerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const glean: LorcanaActionCardDefinition = {
  id: "aqx",
  name: "Glean",
  characteristics: ["action"],
  text: "Banish chosen item. Its owner gains 2 lore.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish chosen item. Its owner gains 2 lore.",
      effects: [
        banishEffect({
          targets: [chosenItemTarget],
          followedBy: gainLoreEffect({
            targets: [targetOwnerTarget],
            value: 2,
          }),
        }),
      ],
    },
  ],
  flavour: "This could be just the thing I need to get my invention working.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
  number: 163,
  set: "URR",
  rarity: "common",
};
