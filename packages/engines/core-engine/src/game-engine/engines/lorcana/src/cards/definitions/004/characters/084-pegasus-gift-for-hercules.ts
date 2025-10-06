import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pegasusGiftForHercules: LorcanaCharacterCardDefinition = {
  id: "lp3",
  reprints: ["w64"],
  name: "Pegasus",
  title: "Gift for Hercules",
  characteristics: ["storyborn", "ally"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
  type: "character",
  abilities: [evasiveAbility],
  flavour: "His name is Pegasus. And he's all yours....\n— Zeus",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  illustrator: "Brian Weisz",
  number: 84,
  set: "URR",
  rarity: "common",
};
