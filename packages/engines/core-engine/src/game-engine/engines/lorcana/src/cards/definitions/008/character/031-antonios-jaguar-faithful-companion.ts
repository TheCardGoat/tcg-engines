import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const antoniosJaguarFaithfulCompanion: LorcanaCharacterCardDefinition = {
  id: "lsm",
  name: "Antonio's Jaguar",
  title: "Faithful Companion",
  characteristics: ["storyborn", "ally"],
  text: "YOU WANT TO GO WHERE? When you play this character, if you have a character in play named Antonio Madrigal, gain 1 lore.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "YOU WANT TO GO WHERE?",
      text: "When you play this character, if you have a character in play named Antonio Madrigal, gain 1 lore.",
      conditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 1 },
          filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            {
              filter: "attribute",
              value: "name",
              comparison: { operator: "eq", value: "Antonio Madrigal" },
            },
          ],
        },
      ],
      effects: [youGainLore(1)],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 4,
  illustrator: "Denny Minonne",
  number: 31,
  set: "008",
  rarity: "common",
  lore: 1,
};
