import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckStruttingHisStuff: LorcanaCharacterCardDefinition = {
  id: "dnp",

  name: "Donald Duck",
  title: "Strutting His Stuff",
  characteristics: ["hero", "dreamborn", "inventor"],
  text: "**Ward** (Opponents can't choose this character except to challenge.)",
  type: "character",
  abilities: [wardAbility],
  flavour: "Walk smarter, not harder.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  illustrator: "Cam Kendell",
  number: 144,
  set: "TFC",
  rarity: "common",
};
