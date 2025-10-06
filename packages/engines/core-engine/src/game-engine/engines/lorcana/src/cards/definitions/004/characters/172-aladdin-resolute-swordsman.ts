import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aladdinResoluteSwordsman: LorcanaCharacterCardDefinition = {
  id: "i0q",
  name: "Aladdin",
  title: "Resolute Swordsman",
  characteristics: ["hero", "storyborn"],
  type: "character",
  flavour:
    "How about we get straight to the part where I leave quickly and you scream after me? No? I can't say I didn't give you a chance.",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Randy Bishop",
  number: 172,
  set: "URR",
  rarity: "common",
};
