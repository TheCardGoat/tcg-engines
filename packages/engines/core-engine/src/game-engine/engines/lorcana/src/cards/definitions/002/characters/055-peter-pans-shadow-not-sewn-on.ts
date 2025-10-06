import {
  evasiveAbility,
  rushAbility,
  yourOtherCharactersWithGain,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peterPansShadowNotSewnOn: LorcanaCharacterCardDefinition = {
  id: "si7",
  reprints: ["bt3"],

  name: "Peter Pan's Shadow",
  title: "Not Sewn On",
  characteristics: ["storyborn", "ally"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**Rush** _(This character can challenge the turn they're played.)_\n\n**TIPTOE** Your other characters with **Rush** gain **Evasive**.",
  type: "character",
  abilities: [
    evasiveAbility,
    rushAbility,
    yourOtherCharactersWithGain({
      name: "Tip Toe",
      text: "Your other characters with **Rush** gain **Evasive**.",
      gainedAbility: evasiveAbility,
      filter: { filter: "ability", value: "rush" },
    }),
  ],
  colors: ["amethyst"],
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Giulia Riva",
  number: 55,
  set: "ROF",
  rarity: "super_rare",
};
