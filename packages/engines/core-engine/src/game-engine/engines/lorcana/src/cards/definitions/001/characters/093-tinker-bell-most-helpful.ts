import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tinkerBellMostHelpful: LorcanitoCharacterCardDefinition = {
  id: "xkn",
  reprints: ["rxt"],
  name: "Tinker Bell",
  title: "Most Helpful",
  characteristics: ["storyborn", "ally", "fairy"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PIXIE DUST** When you play this character, chosen character gains **Evasive** this turn.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Pixie Dust",
      text: "When you play this character, chosen character gains **Evasive** this turn.",
      effects: [
        {
          type: "ability",
          ability: "evasive",
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    }),
    evasiveAbility,
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Caner Soylu",
  number: 93,
  set: "TFC",
  rarity: "common",
};
