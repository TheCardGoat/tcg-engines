import { recklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const teKaTheBurningOne: LorcanaCharacterCardDefinition = {
  id: "cs8",
  name: "Te Ka",
  title: "The Burning One",
  characteristics: ["storyborn", "villain", "deity"],
  text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
  type: "character",
  abilities: [recklessAbility],
  flavour: "She burns for that which was stolen from her.",
  colors: ["ruby"],
  cost: 6,
  strength: 8,
  willpower: 6,
  lore: 0,
  illustrator: "Kamil Murzyn",
  number: 126,
  set: "TFC",
  rarity: "super_rare",
};
