import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const flounderVoiceOfReason: LorcanaCharacterCardDefinition = {
  id: "yxl",
  reprints: ["yyq"],

  name: "Flounder",
  title: "Voice of Reason",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    "„Excitment... adventure... danger lurking around every cor- AAAAAGGH!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Brian Weisz",
  number: 145,
  set: "TFC",
  rarity: "common",
};
