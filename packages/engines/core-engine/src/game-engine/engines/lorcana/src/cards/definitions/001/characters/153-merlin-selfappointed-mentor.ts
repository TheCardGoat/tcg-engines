import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merlinSelfAppointmentMentor: LorcanaCharacterCardDefinition = {
  id: "y4v",

  name: "Merlin",
  title: "Self-Appointed Mentor",
  characteristics: ["dreamborn", "sorcerer", "mentor"],
  text: "**Support** _(Whenever this character quests, you\u0003 may add their {S} to another chosen character‘s {S} this turn.)",
  type: "character",
  abilities: [supportAbility],
  flavour: "What a mess! What a medieval muddle! We'll have to modernize it.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Dave Beauchene",
  number: 153,
  set: "TFC",
  rarity: "common",
};
