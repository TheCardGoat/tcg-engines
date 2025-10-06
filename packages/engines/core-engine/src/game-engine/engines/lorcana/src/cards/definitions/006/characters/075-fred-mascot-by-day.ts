// TODO: Once the set is released, we organize the cards by set and type

import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fredMascotByDay: LorcanaCharacterCardDefinition = {
  id: "paj",
  missingTestCase: true,
  name: "Fred",
  title: "Mascot by Day",
  characteristics: ["hero", "storyborn"],
  text: "**HOW COOL IS THAT** Whenever this character is challenged, gain 2 lore.",
  type: "character",
  abilities: [
    whenChallenged({
      name: "HOW COOL IS THAT",
      text: "Whenever this character is challenged, gain 2 lore.",
      effects: [youGainLore(2)],
    }),
  ],
  flavour: ". . . but by night . . . I am also a school mascot.",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  illustrator: "Cam Kendell / Danielle Powers",
  number: 75,
  set: "006",
  rarity: "common",
};
