import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const crikeePartOfTheTeam: LorcanaCharacterCardDefinition = {
  id: "pul",
  name: "Cri-kee",
  title: "Part of the Team",
  characteristics: ["storyborn", "ally"],
  text: "AT HER SIDE While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "AT HER SIDE",
      text: "While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
      conditions: [
        {
          type: "filter",
          filters: [
            { filter: "status", value: "exerted" },
            { filter: "type", value: "character" },
            { filter: "owner", value: "self" },
            { filter: "zone", value: "play" },
          ],
          comparison: { operator: "gte", value: 2 },
          excludeSelf: true,
        },
      ],
      // @ts-ignore
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 2,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 4,
  willpower: 3,
  illustrator: "Yu Nguyen",
  number: 131,
  set: "008",
  rarity: "common",
  lore: 1,
};
