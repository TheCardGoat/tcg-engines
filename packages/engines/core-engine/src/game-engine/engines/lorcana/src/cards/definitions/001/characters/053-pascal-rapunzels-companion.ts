import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { whileConditionThisCharacterGains } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pascalRapunzelCompanion: LorcanaCharacterCardDefinition = {
  id: "c2y",
  name: "Pascal",
  title: "Rapunzel's Companion",
  characteristics: ["storyborn", "ally"],
  text: "**CAMOUFLAGE** While you have another character in play, this character gains **Evasive**. _(Only characters\rwith Evasive can challenge them.)_",
  type: "character",
  abilities: [
    whileConditionThisCharacterGains({
      name: "Camouflage",
      text: "While you have another character in play, this character gains **Evasive**. _(Only characters\rwith Evasive can challenge them.)_",
      ability: evasiveAbility,
      conditions: [
        {
          type: "not-alone",
        },
      ],
    }),
  ],
  flavour:
    "A true friend is always there for you, whether you can\rsee them or not.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  illustrator: "Brian Weisz",
  number: 53,
  set: "TFC",
  rarity: "uncommon",
};
