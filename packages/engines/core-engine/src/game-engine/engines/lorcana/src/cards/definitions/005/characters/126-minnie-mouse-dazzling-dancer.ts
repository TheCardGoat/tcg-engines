import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import {
  wheneverACharNamedXChallengesAnotherChar,
  wheneverChallengesAnotherChar,
} from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseDazzlingDancer: LorcanaCharacterCardDefinition = {
  id: "z2q",
  missingTestCase: true,
  name: "Minnie Mouse",
  title: "Dazzling Dancer",
  characteristics: ["hero", "dreamborn"],
  text: "**DANCE-OFF** Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
  type: "character",
  abilities: [
    wheneverChallengesAnotherChar({
      name: "DANCE-OFF",
      text: "Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
      effects: [youGainLore(1)],
    }),
    wheneverACharNamedXChallengesAnotherChar({
      name: "DANCE-OFF",
      text: "or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
      effects: [youGainLore(1)],
      characterNamed: "Mickey Mouse",
    }),
  ],
  flavour: "She doesn’t seek the spotlight—the spotlight seeks her.",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Raquel Villanueva",
  number: 126,
  set: "SSK",
  rarity: "uncommon",
};
