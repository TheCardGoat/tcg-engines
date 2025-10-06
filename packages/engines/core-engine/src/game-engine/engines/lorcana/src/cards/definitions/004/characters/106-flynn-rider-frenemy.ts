import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const flynnRiderFrenemy: LorcanaCharacterCardDefinition = {
  id: "n71",
  name: "Flynn Rider",
  title: "Frenemy",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**NARROW AVANTAGE** At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
  type: "character",
  abilities: [
    atTheStartOfYourTurn({
      name: "Narrow Advantage",
      text: "At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
      optional: false,
      conditions: [{ type: "have-strongest-character" }],
      effects: [youGainLore(3)],
    }),
  ],
  flavour:
    '"You guys look busy − I\'ll just keep an eye on this lore for you."',
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Mike Mu",
  number: 106,
  set: "URR",
  rarity: "super_rare",
};
