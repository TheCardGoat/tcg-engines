import { protectorAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beastSelflessProtector: LorcanaCharacterCardDefinition = {
  id: "njt",

  name: "Beast",
  title: "Selfless Protector",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**SHIELD ANOTHER** Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.",
  type: "character",
  abilities: [
    {
      ...protectorAbility,
      name: "Shield Another",
      text: "Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.",
    },
  ],
  flavour: "You'll have to go through me first.",
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 2,
  willpower: 8,
  lore: 1,
  illustrator: "Matthew Robert Davies",
  number: 172,
  set: "ROF",
  rarity: "super_rare",
};
