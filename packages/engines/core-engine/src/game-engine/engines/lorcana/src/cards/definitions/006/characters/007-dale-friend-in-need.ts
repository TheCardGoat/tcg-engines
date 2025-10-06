// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const daleFriendInNeed: LorcanaCharacterCardDefinition = {
  id: "f8n",
  name: "Dale",
  title: "Friend in Need",
  characteristics: ["hero", "storyborn"],
  text: "**CHIP'S PARTNER** This character enters play exerted unless you have a character named Chip in play.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "CHIP'S PARTNER",
      resolutionConditions: [
        {
          type: "filter",
          comparison: { operator: "eq", value: 0 },
          filters: [
            { filter: "zone", value: "play" },
            { filter: "type", value: "character" },
            { filter: "owner", value: "self" },
            {
              filter: "attribute",
              value: "name",
              comparison: { operator: "eq", value: "Chip" },
            },
          ],
        },
      ],
      text: "This character enters play exerted unless you have a character named Chip in play.",
      effects: [
        {
          type: "exert",
          exert: true,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    },
  ],
  flavour: "But Chip, hanging around is what I do best!",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Ron Baird",
  number: 7,
  set: "006",
  rarity: "common",
};
