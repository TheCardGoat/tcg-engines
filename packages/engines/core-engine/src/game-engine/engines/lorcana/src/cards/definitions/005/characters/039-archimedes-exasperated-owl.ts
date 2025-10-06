import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const archimedesExasperatedOwl: LorcanaCharacterCardDefinition = {
  id: "fyr",
  name: "Archimedes",
  title: "Exasperated Owl",
  characteristics: ["storyborn", "ally"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
  type: "character",
  abilities: [evasiveAbility],
  flavour:
    "Hmph. What does an owl have to do to get a little peace and quite around here?",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "Kendall Hale",
  number: 39,
  set: "SSK",
  rarity: "common",
};
