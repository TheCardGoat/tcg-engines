import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const patchPlayfulPup: LorcanaCharacterCardDefinition = {
  id: "pl4",
  name: "Patch",
  title: "Playful Pup",
  characteristics: ["storyborn", "puppy"],
  text: "Ward\nPUPPY BARKING While you have another Puppy character in play, this character gets +1 {L}.",
  type: "character",
  abilities: [
    wardAbility,
    whileConditionThisCharacterGets({
      name: "PUPPY BARKING",
      text: "While you have another Puppy character in play, this character gets +1 {L}.",
      conditions: [
        {
          type: "filter",
          filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "play" },
            { filter: "type", value: "character" },
            { filter: "characteristics", value: ["puppy"] },
          ],
          excludeSelf: true,
          comparison: { operator: "gte", value: 1 },
        },
      ],
      // @ts-ignore
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amber", "sapphire"],
  cost: 1,
  strength: 0,
  willpower: 2,
  illustrator: "Oggy Christiansson",
  number: 25,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
