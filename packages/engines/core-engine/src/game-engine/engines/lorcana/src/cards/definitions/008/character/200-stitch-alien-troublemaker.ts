import {
  drawACard,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import { duringYourTurnWheneverBanishesCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stitchAlienTroublemaker: LorcanaCharacterCardDefinition = {
  id: "yvo",
  name: "Stitch",
  title: "Alien Troublemaker",
  characteristics: ["storyborn", "hero", "alien"],
  text: "I WIN! During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.",
  type: "character",
  abilities: [
    duringYourTurnWheneverBanishesCharacterInChallenge({
      name: "I WIN!",
      text: "During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.",
      optional: true,
      effects: [drawACard, youGainLore(1)],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 3,
  willpower: 4,
  illustrator: "Jeanne Plounevez / Theonidas",
  number: 200,
  set: "008",
  rarity: "rare",
  lore: 1,
};
