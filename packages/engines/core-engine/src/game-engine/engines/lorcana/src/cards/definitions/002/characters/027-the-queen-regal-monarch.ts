import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theQueenRegalMonarch: LorcanaCharacterCardDefinition = {
  id: "vfj",
  reprints: ["ifu"],
  name: "The Queen",
  title: "Regal Monarch",
  characteristics: ["queen", "storyborn", "villain"],
  type: "character",
  flavour:
    "Don't question her. Don't doubt her. And above all, don't disobey her.",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Eva Windermann",
  number: 27,
  set: "ROF",
  rarity: "common",
};
