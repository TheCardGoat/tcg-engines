import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";

export const skullRockIsolatedFortress: LorcanaLocationCardDefinition = {
  id: "sv6",
  missingTestCase: true,
  name: "Skull Rock",
  title: "Isolated Fortress",
  characteristics: [],
  text: "FAMILIAR GROUND Characters get +1 {S} while here.\nSAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Family Ground",
      text: "Characters get +1 {S} while here.",
      ability: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "attribute",
            attribute: "strength",
            amount: 1,
            modifier: "add",
            duration: "static",
            target: thisCharacter,
          },
        ],
      },
    }),
    atTheStartOfYourTurn({
      name: "Safe Haven",
      text: "At the start of your turn, if you have a Pirate character here, gain 1 lore.",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
          filters: [
            {
              filter: "characteristics",
              value: ["pirate"],
            },
          ],
        },
      ],
      effects: [youGainLore(1)],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  willpower: 6,
  moveCost: 1,
  illustrator: "Nicolas Ky",
  number: 136,
  set: "006",
  rarity: "common",
};
