import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maleficentVexedPartygoer: LorcanaCharacterCardDefinition = {
  id: "ejq",
  missingTestCase: true,
  name: "Maleficent",
  title: "Vexed Partygoer",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**WHAT AN AWKWARD SITUATION** Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player’s hand.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "WHAT AN AWKWARD SITUATION",
      text: "Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player’s hand.",
      optional: true,
      dependentEffects: true,
      effects: [
        {
          type: "discard",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
            ],
          },
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              target: thisCharacter,
              effects: [
                {
                  type: "move",
                  to: "hand",
                  target: {
                    type: "card",
                    value: 1,
                    filters: [
                      {
                        filter: "attribute",
                        value: "cost",
                        comparison: { operator: "lte", value: 3 },
                      },
                      {
                        filter: "type",
                        value: ["character", "item", "location"],
                      },
                      { filter: "zone", value: "play" },
                      // { filter: "owner", value: "self" },
                    ],
                  },
                },
              ],
            },
          ],
        } /*,
         */,
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  willpower: 4,
  strength: 0,
  lore: 2,
  illustrator: "Carlos Gomes Cabral",
  number: 51,
  set: "SSK",
  rarity: "uncommon",
};
