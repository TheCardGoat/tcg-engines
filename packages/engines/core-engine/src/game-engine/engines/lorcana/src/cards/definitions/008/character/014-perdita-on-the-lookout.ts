import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const perditaOnTheLookout: LorcanaCharacterCardDefinition = {
  id: "q2j",
  missingTestCase: true,
  name: "Perdita",
  title: "On the Lookout",
  characteristics: ["storyborn", "hero"],
  text: "KEEPING WATCH While you have a Puppy character in play, this character gets +1 {W}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "KEEPING WATCH",
      text: "While you have a Puppy character in play, this character gets +1 {W}.",
      attribute: "willpower",
      amount: 1,
      conditions: [
        {
          type: "filter",
          comparison: {
            operator: "gte",
            value: 1,
          },
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
            { filter: "characteristics", value: ["puppy"] },
          ],
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 4,
  illustrator: "Carmine Pucci",
  number: 14,
  set: "008",
  rarity: "common",
  lore: 1,
};
