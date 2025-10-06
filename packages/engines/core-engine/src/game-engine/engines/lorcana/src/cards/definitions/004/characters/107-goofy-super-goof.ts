import { youGainLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import { wheneverChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goofySuperGoof: LorcanaCharacterCardDefinition = {
  id: "f8o",
  name: "Goofy",
  title: "Super Goof",
  characteristics: ["hero", "storyborn"],
  text: "**Rush** _(This character can challenge the turn they're played)_\n\n**SUPER PEANUT POWERS** Whenever this character challenges another character, gain 2 lore",
  type: "character",
  abilities: [
    rushAbility,
    wheneverChallengesAnotherChar({
      name: "**SUPER PEANUT POWERS**",
      text: "Whenever this character challenges another character, gain 2 lore.",
      effects: [youGainLore(2)],
    }),
  ],
  flavour: "Never underestimate the power of a Goof.",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Justin Runfola",
  number: 107,
  set: "URR",
  rarity: "rare",
};
