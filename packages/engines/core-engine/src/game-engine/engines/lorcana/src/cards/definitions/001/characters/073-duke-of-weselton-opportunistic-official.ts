import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dukeOfWeselton: LorcanitoCharacterCardDefinition = {
  id: "fji",

  name: "Duke Of Weselton",
  title: "Opportunistic Official",
  characteristics: ["storyborn", "villain"],
  type: "character",
  flavour: "Sorcery! I knew there was something dubious going on here.",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "R. La Barbera / L. Giammichele",
  number: 73,
  set: "TFC",
  rarity: "common",
};
