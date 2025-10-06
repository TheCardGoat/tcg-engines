import { chosenOpposingDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goGoTomagoDartingDynamo: LorcanaCharacterCardDefinition = {
  id: "fz6",
  name: "Go Go Tomago",
  title: "Darting Dynamo",
  characteristics: ["hero", "storyborn", "inventor"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**STOP WHINING, WOMAN UP** When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.",
  type: "character",
  abilities: [
    evasiveAbility,
    {
      type: "resolution",
      name: "Stop Whining, Woman Up",
      text: "When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.",
      optional: true,
      costs: [{ type: "ink", amount: 2 }],
      effects: [
        {
          type: "from-target-card-to-target-player",
          player: "effect-owner",
          target: chosenOpposingDamagedCharacter,
          effects: [
            youGainLore({
              dynamic: true,
              target: { attribute: "damage" },
            }),
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Alex Accorsi",
  number: 73,
  set: "006",
  rarity: "rare",
};
