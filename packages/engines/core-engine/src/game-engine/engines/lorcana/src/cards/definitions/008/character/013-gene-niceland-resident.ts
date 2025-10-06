import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const geneNicelandResident: LorcanaCharacterCardDefinition = {
  id: "pmu",
  name: "Gene",
  title: "Niceland Resident",
  characteristics: ["storyborn"],
  text: "I GUESS YOU EARNED THIS Whenever this character quests, you may remove up to 2 damage from chosen character.",
  type: "character",
  abilities: [
    wheneverThisCharacterQuests({
      name: "I GUESS YOU EARNED THIS",
      text: "Whenever this character quests, you may remove up to 2 damage from chosen character.",
      optional: true,
      effects: [
        {
          type: "heal",
          amount: 2,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Rianti Hidayat",
  number: 13,
  set: "008",
  rarity: "common",
  lore: 1,
};
