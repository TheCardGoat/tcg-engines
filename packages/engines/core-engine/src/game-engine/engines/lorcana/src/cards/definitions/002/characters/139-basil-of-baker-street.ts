import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const basilOfBakerStreet: LorcanitoCharacterCardDefinition = {
  id: "ne2",

  name: "Basil",
  title: "Of Baker Street",
  characteristics: ["hero", "dreamborn", "detective"],
  text: "**Support** _(Whenever this character quests, you\u0003 may add their {S} to another chosen character‘s {S} this turn.)_",
  type: "character",
  abilities: [supportAbility],
  flavour:
    "What an ingenious device! If its light is refracted through these, then its images must resolve somewhere below.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Jake Parker",
  number: 139,
  set: "ROF",
  rarity: "common",
};
