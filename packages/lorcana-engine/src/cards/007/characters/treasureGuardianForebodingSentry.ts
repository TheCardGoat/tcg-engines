import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";

export const treasureGuardianForebodingSentry: LorcanitoCharacterCard = {
  id: "ptw",
  name: "Treasure Guardian",
  title: "Foreboding Sentry",
  characteristics: ["storyborn"],
  text: "UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.",
  type: "character",
  abilities: [
    {
      name: "UNTOLD TREASURE",
      text: "When you play this character, if you have an Illusion character in play, you may draw a card.",
      optional: true,
      type: "resolution",
      resolutionConditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 1 },
          filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "characteristics", value: ["illusion"] },
          ],
        },
      ],
      effects: [drawACard],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 3,
  illustrator: "Alexandra Neonakis",
  number: 47,
  set: "007",
  rarity: "common",
  lore: 2,
};
