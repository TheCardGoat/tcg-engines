import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const taffytaMuttonfudgeRuthlessRival: LorcanaCharacterCardDefinition = {
  id: "smx",
  name: "Taffyta Muttonfudge",
  title: "Ruthless Rival",
  characteristics: ["storyborn", "ally", "racer"],
  type: "character",
  flavour:
    "There’s not a glimmer that can keep up with me. You might as well quit now.",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "Koni",
  number: 103,
  set: "SSK",
  rarity: "uncommon",
};
