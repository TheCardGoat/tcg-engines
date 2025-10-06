import { chosenCharacterCharacteristic } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rogerRadcliffeDogLover: LorcanaCharacterCardDefinition = {
  id: "c3f",
  name: "Roger Radcliffe",
  title: "Dog Lover",
  characteristics: ["storyborn", "ally"],
  text: "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "THERE YOU GO",
      text: "Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
      effects: [
        {
          type: "heal",
          amount: 1,
          target: chosenCharacterCharacteristic(["puppy"]),
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Hedvig H-S",
  number: 5,
  set: "007",
  rarity: "common",
  lore: 1,
};
