import { banishChosenItem } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenYouPlayThis } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fredMajorScienceEnthusiast: LorcanaCharacterCardDefinition = {
  id: "k1g",
  missingTestCase: true,
  name: "Fred",
  title: "Major Science Enthusiast",
  characteristics: ["storyborn", "hero"],
  text: "SPITTING FIRE! When you play this character, you may banish chosen item.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "SPITTING FIRE!",
      text: "When you play this character, you may banish chosen item.",
      optional: true,
      effects: [banishChosenItem],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 3,
  illustrator: "Jared Nickell / Patir Balanovsky",
  number: 92,
  set: "008",
  rarity: "common",
  lore: 2,
};
