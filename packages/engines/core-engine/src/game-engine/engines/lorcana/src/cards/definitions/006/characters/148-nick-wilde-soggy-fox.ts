// TODO: Once the set is released, we organize the cards by set and type

import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nickWildeSoggyFox: LorcanaCharacterCardDefinition = {
  id: "odz",
  missingTestCase: true,
  name: "Nick Wilde",
  title: "Soggy Fox",
  characteristics: ["storyborn", "ally"],
  text: "NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "Nice To Have A Partner",
      text: "While you have another character with Support in play, this character gets +2 {S}.",
      attribute: "strength",
      amount: 2,
      conditions: [
        {
          type: "filter",
          filters: [
            { filter: "owner", value: "self" },
            {
              filter: "type",
              value: "character",
            },
            {
              filter: "zone",
              value: "play",
            },
            {
              filter: "ability",
              value: "support",
            },
          ],
          comparison: { operator: "gte", value: 1 },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Lauren Barger",
  number: 148,
  set: "006",
  rarity: "common",
};
