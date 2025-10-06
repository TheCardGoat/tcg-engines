import {
  chosenCharacter,
  chosenOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/target";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theQueenCommandingPresence: LorcanitoCharacterCardDefinition = {
  id: "lwh",
  name: "The Queen",
  title: "Commanding Presence",
  characteristics: ["floodborn", "queen", "villain"],
  text: "**Shift** 2 _You may pay 2 {I} to play this on top of one of your characters named The Queen.)_<br>\n**WHO IS THE FAIREST?** Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
  type: "character",
  abilities: [
    shiftAbility(2, "the queen"),
    wheneverQuests({
      name: "WHO IS THE FAIREST?",
      text: "Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 4,
          modifier: "add",
          target: chosenCharacter,
        },
        {
          type: "attribute",
          attribute: "strength",
          amount: 4,
          modifier: "subtract",
          target: chosenOpposingCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  illustrator: "Matthew Robert Davies / LadyShalirin",
  number: 26,
  set: "ROF",
  rarity: "super_rare",
};
