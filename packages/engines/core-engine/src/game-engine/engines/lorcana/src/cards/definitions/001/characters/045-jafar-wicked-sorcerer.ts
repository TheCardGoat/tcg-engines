import type { ChallengerAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jafarWicked: LorcanitoCharacterCardDefinition = {
  id: "fh0",
  name: "Jafar",
  title: "Wicked Sorcerer",
  characteristics: ["dreamborn", "sorcerer", "villain"],
  text: "**Challenger** +3 (_When challenging, this character get +3 {S}._)",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "challenger",
      value: 3,
      text: "**Challenger** +3 (_When challenging, this character get +3 {S}._)",
    } as ChallengerAbility,
  ],
  flavour:
    "Enough skulking about. It’s time to show that \rsniveling sultan what a sorcerer can do.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  illustrator: "Jake Parker",
  number: 45,
  set: "TFC",
  rarity: "common",
};
