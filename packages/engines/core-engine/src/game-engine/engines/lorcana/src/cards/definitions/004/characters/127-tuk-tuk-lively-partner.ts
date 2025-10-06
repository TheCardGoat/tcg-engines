import { moveToLocation } from "@lorcanito/lorcana-engine/effects/effects";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import {
  chosenCharacterOfYoursIncludingSelf,
  chosenOtherCharacterOfYours,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tukTukLivelyPartner: LorcanaCharacterCardDefinition = {
  id: "fjt",
  reprints: ["lts"],
  name: "Tuk Tuk",
  title: "Lively Partner",
  characteristics: ["ally"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**ON A ROLL** When you play this character, you may move him and one of your other characters to the same location for free. The other character gets +2 {S} this turn.",
  type: "character",
  abilities: [
    evasiveAbility,
    {
      type: "resolution",
      name: "ON A ROLL",
      text: "When you play this character, you may move him and one of your other characters to the same location for free. The other character gets +2 {S} this turn.",
      optional: true,
      dependentEffects: true,
      effects: [
        moveToLocation(chosenCharacterOfYoursIncludingSelf),
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: chosenOtherCharacterOfYours,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Sandra Rios",
  number: 127,
  set: "URR",
  rarity: "rare",
};
