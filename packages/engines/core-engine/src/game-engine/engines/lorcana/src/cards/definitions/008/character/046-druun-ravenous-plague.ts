import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const druunRavenousPlague: LorcanaCharacterCardDefinition = {
  id: "bk0",
  name: "Druun",
  title: "Ravenous Plague",
  characteristics: ["storyborn", "villain"],
  text: "Challenger +4 (While challenging, this character gets +4 {S}.)",
  type: "character",
  abilities: [challengerAbility(4)],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 1,
  willpower: 5,
  illustrator: "Alex Accorsi",
  number: 46,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
