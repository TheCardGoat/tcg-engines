import { haveItemInDiscard } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cogsworthClimbingClock: LorcanaCharacterCardDefinition = {
  id: "lwo",
  name: "Cogsworth",
  title: "Climbing Clock",
  characteristics: ["storyborn", "ally"],
  text: "STILL USEFUL While you have an item card in your discard, this character gets +2 {S}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "STILL USEFUL",
      text: "While you have an item card in your discard, this character gets +2 {S}.",
      conditions: [haveItemInDiscard],
      // @ts-ignore
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "Tony Bancroft / Lindsay Weyman",
  number: 130,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
