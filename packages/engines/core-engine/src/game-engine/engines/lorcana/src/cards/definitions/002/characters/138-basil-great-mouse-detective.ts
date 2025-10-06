import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const basilGreatMouseDetective: LorcanitoCharacterCardDefinition = {
  id: "xau",

  name: "Basil",
  title: "Great Mouse Detective",
  characteristics: ["hero", "floodborn", "detective"],
  text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Basil.)_\n\n**THERE'S ALWAYS A CHANCE** If you used **Shift** to play this character, you may draw 2 cards when he enters play.",
  type: "character",
  abilities: [
    shiftAbility(5, "basil"),
    {
      type: "resolution",
      name: "There's Always a Chance",
      text: "If you used **Shift** to play this character, you may draw 2 cards when he enters play.",
      optional: true,
      resolutionConditions: [{ type: "resolution", value: "shift" }],
      effects: [
        {
          type: "draw",
          amount: 2,
          target: self,
        },
      ],
    },
  ],
  flavour: "A solution always presents itself.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 3,
  illustrator: "Bill Robinson",
  number: 138,
  set: "ROF",
  rarity: "super_rare",
};
