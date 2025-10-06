import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import { whenThisIsBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const puaProtectivePig: LorcanaCharacterCardDefinition = {
  id: "nwe",
  missingTestCase: true,
  name: "Pua",
  title: "Protective Pig",
  characteristics: ["storyborn", "ally"],
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nFREE FRUIT When this character is banished, you may draw a card.",
  type: "character",
  abilities: [
    bodyguardAbility,
    whenThisIsBanished({
      name: "FREE FRUIT",
      text: "When this character is banished, you may draw a card.",
      optional: true,
      effects: [drawACard],
    }),
  ],
  inkwell: true,
  colors: ["amber", "amethyst"],
  cost: 3,
  strength: 2,
  willpower: 2,
  illustrator: "Alexandria Neonakis",
  number: 19,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
