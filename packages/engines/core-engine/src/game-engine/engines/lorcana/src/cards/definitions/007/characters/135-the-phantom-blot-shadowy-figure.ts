import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const thePhantomBlotShadowyFigure: LorcanaCharacterCardDefinition = {
  id: "f3g",
  name: "The Phantom Blot",
  title: "Shadowy Figure",
  characteristics: ["storyborn", "villain"],
  text: "Rush",
  type: "character",
  abilities: [rushAbility],
  inkwell: false,
  colors: ["ruby"],
  cost: 2,
  strength: 3,
  willpower: 1,
  illustrator: "Luca Pinelli",
  number: 135,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
