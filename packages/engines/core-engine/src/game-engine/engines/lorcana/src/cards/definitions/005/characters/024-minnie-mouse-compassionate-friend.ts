import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseCompassionateFriend: LorcanaCharacterCardDefinition = {
  id: "our",
  missingTestCase: true,
  name: "Minnie Mouse",
  title: "Compassionate Friend",
  characteristics: ["hero", "storyborn"],
  text: "**PATCH THEM UP** Whenever this character quests, you may remove up to 2 damage from chosen character.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Patch them up",
      text: "Whenever this character quests, you may remove up to 2 damage from chosen character.",
      effects: [
        {
          type: "heal",
          amount: 2,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  flavour: "Oh my! Is that part of the Illuminary? I have to go help!",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  illustrator: "Gonzalo Kenny",
  number: 24,
  set: "SSK",
  rarity: "common",
};
