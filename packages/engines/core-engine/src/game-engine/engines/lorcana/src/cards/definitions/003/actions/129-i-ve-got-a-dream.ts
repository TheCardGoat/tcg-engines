import {
  allYourCharacters,
  chosenCharacterOfYoursAtLocation,
} from "@lorcanito/lorcana-engine/abilities/targets";
import {
  readyAndCantQuest,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const iveGotADream: LorcanaActionCardDefinition = {
  id: "ntx",
  name: "I've Got a Dream",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nReady chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        ...readyAndCantQuest(chosenCharacterOfYoursAtLocation),
        {
          type: "create-layer-based-on-target",
          resolveAmountBeforeCreatingLayer: true,
          effects: [
            youGainLore({
              dynamic: true,
              targetLocation: { attribute: "lore" },
            }),
          ],
          // TODO: Get rid of target
          target: allYourCharacters,
        },
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
