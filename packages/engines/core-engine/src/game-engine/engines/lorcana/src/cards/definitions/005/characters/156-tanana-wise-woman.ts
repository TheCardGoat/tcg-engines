import { chosenCharacterOrLocation } from "@lorcanito/lorcana-engine/abilities/target";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tananaWiseWoman: LorcanaCharacterCardDefinition = {
  id: "x30",
  name: "Tanana",
  title: "Wise Woman",
  characteristics: ["storyborn", "ally"],
  text: "**YOUR BROTHERS NEED GUIDANCE** When you play this character, you may remove up to 1 damage from chosen character or location.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "YOUR BROTHERS NEED GUIDANCE",
      text: "When you play this character, you may remove up to 1 damage from chosen character or location.",
      optional: true,
      effects: [{ type: "heal", amount: 1, target: chosenCharacterOrLocation }],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 156,
  set: "SSK",
  rarity: "common",
};
