import type {
  AttributeEffect,
  LorcanitoCharacterCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import { eachOpponentLosesXLore } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";

const humblePie: ResolutionAbility = {
  type: "resolution",
  name: "Humble Pie",
  text: "When you play this character, if you used **Shift** to play him, each opponent loses 2 lore.",
  resolutionConditions: [
    {
      type: "resolution",
      value: "shift",
    },
  ],
  effects: [eachOpponentLosesXLore(2)],
};

const attributeEffeect: AttributeEffect = {
  type: "attribute",
  attribute: "strength",
  amount: 6,
  modifier: "add",
  target: thisCharacter,
};

export const donaldDuckPieSlinger: LorcanaCharacterCardDefinition = {
  id: "t57",
  name: "Donald Duck",
  title: "Pie Slinger",
  characteristics: ["hero", "floodborn", "knight"],
  text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Donald Duck.)_ **HUMBLE PIE** When you play this character, if you used **Shift** to play him, each opponent loses 2 lore. **RAGING DUCK** While an opponent has 10 or more lore, this character gets +6 {S}.",
  type: "character",
  abilities: [
    shiftAbility(4, "Donald Duck"),
    humblePie,
    whileConditionThisCharacterGets({
      name: "Raging Duck",
      text: "While an opponent has 10 or more lore, this character gets +6 {S}.",
      conditions: [
        {
          type: "player",
          player: "opponent",
          attribute: "lore",
          comparison: { operator: "gte", value: 10 },
        },
      ],
      effects: [attributeEffeect],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 1,
  illustrator: "César Vergara",
  number: 107,
  set: "SSK",
  rarity: "legendary",
};
