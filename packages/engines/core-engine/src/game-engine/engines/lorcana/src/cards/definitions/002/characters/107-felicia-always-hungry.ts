import { recklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const feliciaAlwaysHungry: LorcanaCharacterCardDefinition = {
  id: "trb",

  name: "Felicia",
  title: "Always Hungry",
  characteristics: ["dreamborn", "ally"],
  text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
  type: "character",
  abilities: [recklessAbility],
  flavour:
    "This isn't how most cat-and-mouse games go, is it, Dr. Dawson? \n−Basil",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  strength: 3,
  lore: 0,
  willpower: 1,
  illustrator: "Michael Cookie Niewiadomy",
  number: 107,
  set: "ROF",
  rarity: "common",
};
