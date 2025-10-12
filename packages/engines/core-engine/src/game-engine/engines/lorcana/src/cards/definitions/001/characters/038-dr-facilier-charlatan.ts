import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const drFacilierCharlatan: LorcanaCharacterCardDefinition = {
  id: "fov",

  name: "Dr. Facilier",
  title: "Charlatan",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
  type: "character",
  strength: 0,
  abilities: [challengerAbility(2)],
  flavour: "Enchantée. A tip of the hat from Dr. Facilier.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Grace Tran",
  number: 38,
  set: "TFC",
  rarity: "common",
};
