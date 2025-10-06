import { recklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tongSurvivor: LorcanitoCharacterCardDefinition = {
  id: "b8u",
  name: "Tong",
  title: "Survivor",
  characteristics: ["storyborn", "ally"],
  text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
  type: "character",
  abilities: [recklessAbility],
  flavour: "I too wish to join this fellowship of Druun butt-kickery.",
  colors: ["ruby"],
  cost: 4,
  strength: 3,
  willpower: 6,
  illustrator: "Mike Parker",
  number: 126,
  lore: 0,
  set: "URR",
  rarity: "common",
};
