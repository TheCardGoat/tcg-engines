import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const flounderCollectorsCompanion: LorcanaCharacterCardDefinition = {
  id: "ti7",
  name: "Flounder",
  title: "Collector's Companion",
  characteristics: ["storyborn", "ally"],
  text: "**Support** _(Whenever this character quests, you mad add their {S} to another chosen character's {S} this turn.)_\n\n\n**I'M NOT A GUPPY** If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
  type: "character",
  abilities: [
    supportAbility,
    whenYouPlayThisForEachYouPayLess({
      name: "I'M NOT A GUPPY",
      text: "If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
      amount: 1,
      conditions: [
        {
          type: "filter",
          comparison: {
            operator: "gte",
            value: 1,
          },
          filters: [
            ...chosenCharacterOfYours.filters,
            {
              filter: "attribute",
              value: "name",
              comparison: { operator: "eq", value: "Ariel" },
            },
          ],
        },
      ],
    }),
  ],
  flavour: '"Ariel, Ariel! You won\'t believe what I found!"',
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "James C Mulligan",
  number: 144,
  set: "URR",
  rarity: "uncommon",
};
