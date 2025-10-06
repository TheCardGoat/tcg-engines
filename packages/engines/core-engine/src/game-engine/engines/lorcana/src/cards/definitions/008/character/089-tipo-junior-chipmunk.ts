import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tipoJuniorChipmunk: LorcanaCharacterCardDefinition = {
  id: "yv7",
  name: "Tipo",
  title: "Junior Chipmunk",
  characteristics: ["storyborn", "ally"],
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  type: "character",
  abilities: [evasiveAbility],
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Florencia Vazquez",
  number: 89,
  set: "008",
  rarity: "common",
  lore: 1,
};
