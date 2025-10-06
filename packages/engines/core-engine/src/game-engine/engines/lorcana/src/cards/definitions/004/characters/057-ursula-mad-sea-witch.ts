import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulaMadSeaWitch: LorcanitoCharacterCardDefinition = {
  id: "l0q",
  name: "Ursula",
  title: "Mad Sea Witch",
  characteristics: ["dreamborn", "sorcerer", "villain"],
  text: "**Challenger +2** _(While challenging, this character gets +2 {S}.)_",
  type: "character",
  abilities: [challengerAbility(2)],
  flavour:
    "After her, Flotsam! I can't rule Lorcana without the Hexwell Crown!",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Adam Ford",
  number: 57,
  set: "URR",
  rarity: "uncommon",
};
