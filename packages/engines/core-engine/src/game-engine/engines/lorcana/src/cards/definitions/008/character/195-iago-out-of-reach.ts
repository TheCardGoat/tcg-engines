import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const iagoOutOfReach: LorcanaCharacterCardDefinition = {
  id: "z25",
  name: "Iago",
  title: "Out of Reach",
  characteristics: ["storyborn", "ally"],
  text: "SELF-PRESERVATION While you have another exerted character in play, this character can't be challenged.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "Self-Preservation",
      text: "While you have another exerted character in play, this character can't be challenged.",
      conditions: [
        {
          type: "filter",
          filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "play" },
            { filter: "status", value: "exerted" },
          ],
          comparison: { operator: "gte", value: 1 },
          excludeSelf: true,
        },
      ],
      // @ts-ignore
      effects: [
        {
          type: "restriction",
          restriction: "be-challenged",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 3,
  willpower: 3,
  illustrator: "Carlos Luzzi",
  number: 195,
  set: "008",
  rarity: "rare",
  lore: 2,
};
