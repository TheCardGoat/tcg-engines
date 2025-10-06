import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rafikiMysterious: LorcanaCharacterCardDefinition = {
  id: "v97",
  name: "Rafiki",
  title: "Mysterious Sage",
  characteristics: ["dreamborn", "sorcerer", "mentor"],
  text: "**Rush** _(This character can challenge the turn they're played.)_",
  type: "character",
  abilities: [rushAbility],
  flavour:
    "The past can hurt. But the way I see it, you can either run from it or learn from it.",
  colors: ["amethyst"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Giulia Riva",
  number: 54,
  set: "TFC",
  rarity: "uncommon",
};
