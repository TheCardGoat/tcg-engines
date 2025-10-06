import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const drFacilierSavvyOpportunist: LorcanaCharacterCardDefinition = {
  id: "pda",

  name: "Dr. Facilier",
  title: "Savvy Opportunist",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
  type: "character",
  abilities: [evasiveAbility],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  illustrator: "Leonardo Giammichele",
  number: 38,
  set: "ROF",
  rarity: "common",
};
