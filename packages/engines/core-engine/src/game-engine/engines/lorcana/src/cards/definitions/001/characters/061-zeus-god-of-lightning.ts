import {
  type ChallengerAbility,
  rushAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const zeusGodOfLightning: LorcanitoCharacterCardDefinition = {
  id: "wvl",
  name: "Zeus",
  title: "God of Lightning",
  characteristics: ["storyborn", "deity"],
  text: "**Rush** _(This character can challenge the turn they're played.)_\n**Challenger** +4 (_When challenging, this character get +4 {S}._)",
  type: "character",
  strength: 0,
  abilities: [
    {
      type: "static",
      ability: "challenger",
      value: 4,
      text: "**Challenger** +4 (_When challenging, this character get +4 {S}._)",
    } as ChallengerAbility,
    rushAbility,
  ],
  flavour: "A little lightning solves a whole lot of problems.",
  colors: ["amethyst"],
  cost: 4,
  willpower: 4,
  lore: 2,
  illustrator: "Koni",
  number: 61,
  set: "TFC",
  rarity: "rare",
};
