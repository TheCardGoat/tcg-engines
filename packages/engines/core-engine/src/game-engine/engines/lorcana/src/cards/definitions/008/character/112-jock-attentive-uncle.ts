import { haveXorMoreCharactersInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jockAttentiveUncle: LorcanaCharacterCardDefinition = {
  id: "zvl",
  name: "Jock",
  title: "Attentive Uncle",
  characteristics: ["storyborn", "ally"],
  text: "VOICE OF EXPERIENCE When you play this character, if you have 3 or more other characters in play, gain 2 lore.",
  type: "character",
  abilities: [
    whenYouPlayThisCharacter({
      name: "VOICE OF EXPERIENCE",
      text: "When you play this character, if you have 3 or more other characters in play, gain 2 lore.",
      conditions: [haveXorMoreCharactersInPlay(4)],
      effects: [youGainLore(2)],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 4,
  illustrator: "Raquel Villanueva",
  number: 112,
  set: "008",
  rarity: "common",
  lore: 1,
};
