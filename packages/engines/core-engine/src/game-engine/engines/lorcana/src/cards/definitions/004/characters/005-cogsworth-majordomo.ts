import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cogsworthMajordomo: LorcanitoCharacterCardDefinition = {
  id: "kfo",
  name: "Cogsworth",
  title: "Majordomo",
  characteristics: ["dreamborn", "ally"],
  text: "**AS YOU WERE!** Whenever this character quests, you may give chosen character -2 {S} until the start of your next turn.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "AS YOU WERE!",
      text: "Whenever this character quests, you may give chosen character -2 {S} until the start of your next turn.",
      optional: true,
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "subtract",
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  flavour: "If it's a fight they want, we'll be ready for them.",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Jeodo Neurhaffer",
  number: 5,
  set: "URR",
  rarity: "common",
};
