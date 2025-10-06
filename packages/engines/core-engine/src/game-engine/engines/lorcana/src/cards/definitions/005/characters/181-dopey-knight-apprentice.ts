import { chosenCharacterOrLocation } from "@lorcanito/lorcana-engine/abilities/target";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dopeyKnightApprentice: LorcanaCharacterCardDefinition = {
  id: "hwb",
  missingTestCase: true,
  name: "Dopey",
  title: "Knight Apprentice",
  characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
  text: "**STRONGER TOGETHER** When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Stronger Together",
      text: "When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
      optional: true,
      resolutionConditions: [
        {
          type: "filter",
          filters: [
            { filter: "characteristics", value: ["knight"] },
            { filter: "owner", value: "self" },
            { filter: "zone", value: "play" },
          ],
          comparison: { operator: "gte", value: 2 },
        },
      ],
      effects: [dealDamageEffect(1, chosenCharacterOrLocation)],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 181,
  set: "SSK",
  rarity: "common",
};
