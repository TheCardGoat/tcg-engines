import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ticktockEverpresentPursuer: LorcanaCharacterCardDefinition = {
  id: "sq0",
  reprints: ["znh"],
  name: "Tick-Tock",
  title: "Ever-Present Pursuer",
  characteristics: ["storyborn", "ally"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
  type: "character",
  abilities: [evasiveAbility],
  flavour:
    "That cursed beast liked the taste of me so well he's followed me ever since... − Captain Hook",
  inkwell: true,
  colors: ["amethyst"],
  cost: 6,
  strength: 4,
  willpower: 7,
  lore: 1,
  illustrator: "Kenneth Anderson",
  number: 56,
  set: "URR",
  rarity: "common",
};
