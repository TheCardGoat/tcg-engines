import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peterPanNeverLanding: LorcanaCharacterCardDefinition = {
  id: "o91",
  name: "Peter Pan",
  title: "Never Landing",
  characteristics: ["hero", "dreamborn"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
  type: "character",
  abilities: [evasiveAbility],
  flavour: "What's the matter, Hook? Can't you fly?",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Koni",
  number: 91,
  set: "TFC",
  rarity: "common",
};
