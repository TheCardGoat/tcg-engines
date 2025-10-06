import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mirabelMadrigalFamilyGatherer: LorcanitoCharacterCardDefinition = {
  id: "bjy",
  name: "Mirabel Madrigal",
  title: "Family Gatherer",
  characteristics: ["hero", "storyborn", "madrigal"],
  text: "**NOT WITHOUT MY FAMILY** You can’t play this character unless you have 5 or more characters in play.",
  type: "character",
  abilities: [
    {
      type: "play-condition",
      name: "NOT WITHOUT MY FAMILY",
      text: "You can’t play this character unless you have 5 or more characters in play.",
      conditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 5 },
          filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
          ],
        },
      ],
    },
  ],
  flavour: "There’s nothing we can’t accomplish together!",
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 5,
  illustrator: "Emily Abeydeera",
  number: 14,
  set: "SSK",
  rarity: "legendary",
};
