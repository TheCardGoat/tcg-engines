import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const teKaLavaMonster: LorcanaCharacterCardDefinition = {
  id: "zzf",
  name: "Te Ka",
  title: "Lava Monster",
  characteristics: ["storyborn", "villain", "deity"],
  text: "Challenger +2",
  type: "character",
  abilities: [challengerAbility(2)],
  inkwell: true,
  colors: ["amethyst"],
  cost: 6,
  strength: 5,
  willpower: 6,
  illustrator: "Max Grecke",
  number: 58,
  set: "007",
  rarity: "common",
  lore: 2,
};
