import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stitchTeamUnderdog: LorcanaCharacterCardDefinition = {
  id: "ovo",
  missingTestCase: true,
  name: "Stitch",
  title: "Team Underdog",
  characteristics: ["hero", "alien", "storyborn"],
  text: "**HEAVE HO!** When you play this character, you may deal 2 damage to chosen character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "HEAVE HO!",
      text: "When you play this character, you may deal 2 damage to chosen character.",
      effects: [dealDamageEffect(2, chosenCharacter)],
    },
  ],
  flavour:
    "He's not the biggest glimmer on the team, but he still packs a wallop.",
  colors: ["steel"],
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Karen Hellon",
  number: 171,
  set: "SSK",
  rarity: "uncommon",
};
