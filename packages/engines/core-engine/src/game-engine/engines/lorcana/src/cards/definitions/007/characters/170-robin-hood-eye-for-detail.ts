import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const robinHoodEyeForDetail: LorcanaCharacterCardDefinition = {
  id: "fz9",
  name: "Robin Hood",
  title: "Eye for Detail",
  characteristics: ["storyborn", "hero"],
  text: "Support",
  type: "character",
  abilities: [supportAbility],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "Mariana Moreno",
  number: 170,
  set: "007",
  rarity: "common",
  lore: 1,
};
