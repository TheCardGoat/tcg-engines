import { eachOpponentLosesXLore } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckDaisysDate: LorcanaCharacterCardDefinition = {
  id: "thl",
  name: "Donald Duck",
  title: "Daisy's Date",
  characteristics: ["storyborn", "ally"],
  text: "**PLUCKY PLAY** Whenever this character challenges another character, each opponent loses 1 lore.",
  type: "character",
  abilities: [
    wheneverChallengesAnotherChar({
      name: "PLUCKY PLAY",
      text: "Whenever this character challenges another character, each opponent loses 1 lore.",
      effects: [eachOpponentLosesXLore(1)],
    }),
  ],
  flavour: "He keeps his eye on the prize.",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Francesco D'ippolito / Giuseppe di Maio",
  number: 122,
  set: "SSK",
  rarity: "common",
};
