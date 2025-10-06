import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const daisyDuckSpotlessFoodfighter: LorcanaCharacterCardDefinition = {
  id: "r79",
  name: "Daisy Duck",
  title: "Spotless Food-Fighter",
  characteristics: ["hero", "storyborn"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
  type: "character",
  abilities: [evasiveAbility],
  flavour: "She has an unblemished record.",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Maddie Shilt",
  number: 111,
  set: "SSK",
  rarity: "common",
};
