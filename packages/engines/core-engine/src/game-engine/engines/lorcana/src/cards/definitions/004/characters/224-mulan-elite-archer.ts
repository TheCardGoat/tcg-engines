import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import {
  chosenCharacter,
  thisCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverThisCharacterDealsDamageInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanEliteArcher: LorcanaCharacterCardDefinition = {
  id: "nst",
  reprints: ["t4r"],
  name: "Mulan",
  title: "Elite Archer",
  characteristics: ["hero", "floodborn", "princess"],
  text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Mulan.)_ **STRAIGHT SHOOTER** When you play this character, if you used **Shift** to play her, she gets +3 {S} this turn. **TRIPPLE SHOT** During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.",
  type: "character",
  abilities: [
    shiftAbility(5, "Mulan"),
    {
      type: "resolution",
      name: "Straight Shooter",
      text: "When you play this character, if you used **Shift** to play her, she gets +3 {S} this turn.",
      resolutionConditions: [{ type: "resolution", value: "shift" }],
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 3,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    },
    wheneverThisCharacterDealsDamageInChallenge({
      name: "Triple Shot",
      text: "During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.",
      conditions: [{ type: "during-turn", value: "self" }],
      effects: [
        dealDamageEffect(
          {
            dynamic: true,
            getAmountFromTrigger: true,
          },
          { ...chosenCharacter, value: 2, upTo: true },
        ),
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  illustrator: "Nicola Saviori",
  number: 224,
  set: "URR",
  rarity: "legendary",
};
