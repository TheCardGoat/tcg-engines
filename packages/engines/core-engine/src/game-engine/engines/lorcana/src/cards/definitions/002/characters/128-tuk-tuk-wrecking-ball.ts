import { recklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tukTukWreckingBall: LorcanitoCharacterCardDefinition = {
  id: "nqd",

  name: "Tuk Tuk",
  title: "Wrecking Ball",
  characteristics: ["storyborn", "ally"],
  text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
  type: "character",
  abilities: [recklessAbility],
  flavour: "A good friend is always ready to roll.",
  colors: ["ruby"],
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 0,
  illustrator: "Brian Weisz",
  number: 128,
  set: "ROF",
  rarity: "rare",
};
