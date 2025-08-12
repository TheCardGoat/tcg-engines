import { locationStat } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  gainLoreEffect,
  restrictEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterOfYoursTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { youPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const iveGotADream: LorcanaActionCardDefinition = {
  id: "ntx",
  name: "I've Got a Dream",
  characteristics: ["action", "song"],
  text: "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.",
      effects: [
        { type: "ready", targets: [chosenCharacterOfYoursTarget] },
        restrictEffect({
          targets: [chosenCharacterOfYoursTarget],
          restriction: "quest",
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        gainLoreEffect({
          targets: [youPlayerTarget],
          value: locationStat("lore", "current"),
        }),
      ],
    },
  ],
  flavour:
    "Tor would like to quit and be a florist \nGunther does interior design",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Cacciatore Michaela",
  number: 129,
  set: "ITI",
  rarity: "uncommon",
};
