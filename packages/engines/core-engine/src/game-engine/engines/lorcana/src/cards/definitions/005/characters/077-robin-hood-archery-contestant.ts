import { youGainLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const robinHoodArcheryContestant: LorcanaCharacterCardDefinition = {
  id: "by3",
  missingTestCase: true,
  name: "Robin Hood",
  title: "Archery Contestant",
  characteristics: ["hero", "storyborn"],
  text: "**TRICK SHOT** When you play this character, if an opponent has a damaged character in play, gain 1 lore.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "**TRICK SHOT**",
      text: "When you play this character, if an opponent has a damaged character in play, gain 1 lore.",
      resolutionConditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 1 },
          filters: [
            { filter: "type", value: "character" },
            { filter: "owner", value: "opponent" },
            {
              filter: "status",
              value: "damage",
              comparison: { operator: "gte", value: 1 },
            },
          ],
        },
      ],
      effects: [youGainLore(1)],
    },
  ],
  flavour: "For a second there, I thought this might be a real challenge.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Oggy Christiansson",
  number: 77,
  set: "SSK",
  rarity: "common",
};
