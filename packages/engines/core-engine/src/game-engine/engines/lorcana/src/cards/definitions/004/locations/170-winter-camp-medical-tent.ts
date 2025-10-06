import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { healEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverACharacterQuestsWhileHere } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

export const winterCampMedicalTent: LorcanaLocationCardDefinition = {
  id: "ppi",
  missingTestCase: true,
  name: "Winter Camp",
  title: "Medical Tent",
  characteristics: ["location"],
  text: "**HELP THE WOUNDED** Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
  type: "location",
  abilities: [
    wheneverACharacterQuestsWhileHere({
      name: "Help the Wounded",
      text: "Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
      effects: [healEffect(2, thisCharacter)],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  moveCost: 1,
  willpower: 8,
  lore: 1,
  illustrator: "Elodie Mondoloni",
  number: 170,
  set: "URR",
  rarity: "common",
};
