import { allYourCharactersWithAnSpecificAbility } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const joeyBluePigeon: LorcanaCharacterCardDefinition = {
  id: "noe",
  name: "Joey",
  title: "Blue Pigeon",
  characteristics: ["storyborn"],
  text: "I'VE GOT JUST THE THING Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.",
  type: "character",
  abilities: [
    wheneverThisCharacterQuests({
      name: "I'VE GOT JUST THE THING",
      text: "Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.",
      optional: true,
      effects: [
        {
          type: "heal",
          amount: 1,
          target: allYourCharactersWithAnSpecificAbility("bodyguard"),
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "French Carlomagno",
  number: 36,
  set: "008",
  rarity: "common",
  lore: 1,
};
