import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aladdinPrinceAli: LorcanaCharacterCardDefinition = {
  id: "j5x",
  reprints: ["n78"],

  name: "Aladdin",
  title: "Prince Ali",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_",
  type: "character",
  illustrator: "Lauren Walsh",
  abilities: [wardAbility],
  flavour:
    "Fabulously wealthy. Practically untouchable. Genuinely inauthentic.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  number: 69,
  set: "TFC",
  rarity: "common",
};
