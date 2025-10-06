import { youGainLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverYouReadyThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const wrechitRalphDemolitionDude: LorcanaCharacterCardDefinition = {
  id: "lpn",
  name: "Wreck-It Ralph",
  title: "Demolition Dude",
  characteristics: ["hero", "storyborn"],
  text: "**REFRESHING BREAK** Whenever you ready this character, gain 1 lore for each 1 damage on him.",
  type: "character",
  abilities: [
    wheneverYouReadyThisCharacter({
      name: "Refreshing Break",
      text: "Whenever you ready this character, gain 1 lore for each 1 damage on him.",
      effects: [youGainLore({ dynamic: true, sourceAttribute: "damage" })],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Lisanne Koeteeuw",
  number: 104,
  set: "SSK",
  rarity: "rare",
};
