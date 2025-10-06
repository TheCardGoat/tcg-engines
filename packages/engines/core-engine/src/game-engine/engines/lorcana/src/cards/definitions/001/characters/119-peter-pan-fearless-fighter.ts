import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peterPanFearless: LorcanitoCharacterCardDefinition = {
  id: "luv",

  name: "Peter Pan",
  title: "Fearless Fighter",
  illustrator: "Anh Dang",
  characteristics: ["hero", "storyborn"],
  text: "**Rush** _(This character can challenge the turn they're played.)_",
  type: "character",
  abilities: [rushAbility],
  flavour:
    "Nobody calls Pan a coward and lives! I'll fight you man-to-man, with one hand behind my back.",
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  number: 119,
  set: "TFC",
  rarity: "common",
};
