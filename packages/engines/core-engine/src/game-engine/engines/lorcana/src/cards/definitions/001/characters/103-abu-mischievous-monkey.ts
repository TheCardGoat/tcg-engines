import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const abuMischievenusMonkey: LorcanitoCharacterCardDefinition = {
  id: "pbo",
  name: "Abu",
  title: "Mischievous Monkey",
  illustrator: "Oleg Yurkov",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    "Someday, Abu, things are gonna change. We'll be rich, live in a palace, and never have any problems at all.\n−Aladdin",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  number: 103,
  set: "TFC",
  rarity: "common",
};
