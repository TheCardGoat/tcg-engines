import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rayEasygoingFirefly: LorcanitoCharacterCardDefinition = {
  id: "fdk",
  name: "Ray",
  title: "Easygoing Firefly",
  characteristics: ["storyborn", "ally"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
  type: "character",
  abilities: [evasiveAbility],
  flavour: "He may be hard to follow, but his heart isn't.",
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 3,
  illustrator: "Filipe Laurentino",
  number: 92,
  set: "ROF",
  rarity: "common",
};
