import {
  evasiveAbility,
  rushAbility,
  yourOtherCharactersWithGain,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peterPanShadowFinder: LorcanitoCharacterCardDefinition = {
  id: "o7c",
  name: "Peter Pan",
  title: "Shadow Finder",
  characteristics: ["hero", "storyborn"],
  text: "**Rush** _(This character can challenge the turn they're played.)_\n\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**FLY, OF COURSE!** Your other characters with **Evasive** gain **Rush.**",
  type: "character",
  abilities: [
    rushAbility,
    evasiveAbility,
    yourOtherCharactersWithGain({
      name: "Fly, Of Course!",
      text: "Your other characters with **Evasive** gain **Rush.**",
      gainedAbility: rushAbility,
      filter: { filter: "ability", value: "evasive" },
    }),
  ],
  colors: ["amethyst"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Emily Abeydeera",
  number: 54,
  set: "URR",
  rarity: "super_rare",
};
