import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const madamMimCheatingSpellcaster: LorcanaCharacterCardDefinition = {
  id: "hsi",
  name: "Madam Mim",
  title: "Cheating Spellcaster",
  characteristics: ["storyborn", "villain", "sorcerer"],
  text: "PLAY ROUGH Whenever this character quests, exert chosen opposing character.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "PLAY ROUGH",
      text: "Whenever this character quests, exert chosen opposing character.",
      effects: [
        {
          type: "exert",
          exert: true,
          target: chosenOpposingCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 6,
  strength: 4,
  willpower: 5,
  illustrator: "Jocelyn Sepulveda",
  number: 56,
  set: "007",
  rarity: "rare",
  lore: 2,
};
