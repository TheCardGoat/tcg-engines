import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const genieOnTheJob: LorcanaCharacterCardDefinition = {
  id: "tgk",
  name: "Genie",
  title: "On the Job",
  characteristics: ["storyborn", "ally"],
  text: "**Evasive** (_Only characters with Evasive can challenge this character._)\n**DISAPPEAR** When you play this character, you may return chosen character to their player's hand.",
  type: "character",
  abilities: [
    evasiveAbility,
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Disappear",
      text: "When you play this character, you may return chosen character to their player's hand.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenCharacter,
        },
      ],
    }),
  ],
  flavour:
    "Can your friends go ‘Abracadabra, let ’er rip’ and then make the sucker disappear?",
  colors: ["emerald"],
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Giulia Riva",
  number: 75,
  set: "TFC",
  rarity: "super_rare",
};
