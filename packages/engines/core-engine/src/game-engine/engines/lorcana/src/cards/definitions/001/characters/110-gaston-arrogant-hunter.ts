import { recklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gastonArrogantHunter: LorcanaCharacterCardDefinition = {
  id: "j7q",
  reprints: ["k2n"],

  name: "Gaston",
  title: "Arrogant Hunter",
  characteristics: ["storyborn", "villain"],
  text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
  type: "character",
  abilities: [recklessAbility],
  flavour: "It's not arrogance when you really <b>are</b> the best.",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 4,
  willpower: 2,
  lore: 0,
  illustrator: "Matthew Robert Davies",
  number: 110,
  set: "TFC",
  rarity: "common",
};
