import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const balooVonBruinwaldXiii: LorcanaCharacterCardDefinition = {
  id: "p52",
  missingTestCase: true,
  name: "Baloo",
  title: "Von Bruinwald XIII",
  characteristics: ["hero", "dreamborn"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n\n**LET'S MAKE LIKE A TREE** When this character is banished, gain 2 lore.",
  type: "character",
  abilities: [
    bodyguardAbility,
    whenThisCharacterBanished({
      name: "Let's make like a tree",
      text: "When this character is banished, gain 2 lore.",
      effects: [
        {
          type: "lore",
          amount: 2,
          modifier: "add",
          target: self,
        },
      ],
    }),
  ],
  colors: ["amber"],
  willpower: 3,
  strength: 0,
  cost: 3,
  lore: 1,
  illustrator: "Cam Kendell",
  number: 1,
  set: "ITI",
  rarity: "rare",
};
