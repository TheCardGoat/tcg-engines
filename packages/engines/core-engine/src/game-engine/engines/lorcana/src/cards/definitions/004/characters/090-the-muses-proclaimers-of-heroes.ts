import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { wheneverYouPlayASong } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theMusesProclaimersOfHeroes: LorcanitoCharacterCardDefinition = {
  id: "sir",
  missingTestCase: true,
  name: "The Muses",
  title: "Proclaimers of Heroes",
  characteristics: ["storyborn", "ally"],
  text: "**WARD** _(Opponents can't choose this character except to challenge.)_\n\n**THE GOSPEL TRUTH** Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
  type: "character",
  abilities: [
    wardAbility,
    wheneverYouPlayASong({
      name: "The Gospel Truth",
      text: "Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "strength",
                comparison: { operator: "lte", value: 2 },
              },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Brittney Hackett",
  number: 90,
  set: "URR",
  rarity: "rare",
};
