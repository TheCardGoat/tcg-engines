import { banishChosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peteSteamboatRival: LorcanaCharacterCardDefinition = {
  id: "r5l",
  name: "Pete",
  title: "Steamboat Rival",
  characteristics: ["storyborn", "villain"],
  text: "**SCRAM!** When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Scram!",
      text: "When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
      optional: true,
      resolutionConditions: [
        {
          type: "filter",
          // He himself counts as 1
          comparison: { operator: "gt", value: 1 },
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
            {
              filter: "attribute",
              value: "name",
              comparison: { operator: "eq", value: "Pete" },
            },
          ],
        },
      ],
      effects: [banishChosenOpposingCharacter],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 2,
  illustrator: "Louis Jones",
  number: 116,
  set: "SSK",
  rarity: "super_rare",
};
