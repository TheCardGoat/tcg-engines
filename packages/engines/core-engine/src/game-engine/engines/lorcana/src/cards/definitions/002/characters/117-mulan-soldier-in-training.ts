import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanSoldierInTraining: LorcanitoCharacterCardDefinition = {
  id: "tzn",
  name: "Mulan",
  title: "Soldier in Training",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**Rush** _(This character can challenge the turn they're played.)_",
  type: "character",
  abilities: [rushAbility],
  flavour: '"I have to do something!"',
  colors: ["ruby"],
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  illustrator: 'Michael "Cookie" Niewiadomy',
  number: 117,
  set: "ROF",
  rarity: "common",
};
