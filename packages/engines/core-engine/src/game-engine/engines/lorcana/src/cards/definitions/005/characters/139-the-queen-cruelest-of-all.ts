import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theQueenCruelestOfAll: LorcanitoCharacterCardDefinition = {
  id: "mjg",
  name: "The Queen",
  title: "Cruelest of All",
  characteristics: ["queen", "sorcerer", "storyborn", "villain"],
  text: "**Ward** _(Opponents can’t choose this character except to challenge.)_",
  type: "character",
  abilities: [wardAbility],
  flavour:
    "She’d seen what the ink could do for other glimmers. What could it do for her?",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  willpower: 4,
  strength: 0,
  lore: 1,
  illustrator: "Carmine Pucci",
  number: 139,
  set: "SSK",
  rarity: "common",
};
