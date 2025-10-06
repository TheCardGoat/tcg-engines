import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const calhounHardnosedLeader: LorcanaCharacterCardDefinition = {
  id: "tnp",
  name: "Calhoun",
  title: "Hard-Nosed Leader",
  characteristics: ["storyborn", "hero"],
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nLOOT DROP When this character is banished, gain 1 lore.",
  type: "character",
  abilities: [
    bodyguardAbility,
    whenThisCharacterBanished({
      name: "LOOT DROP",
      text: "When this character is banished, gain 1 lore.",
      effects: [youGainLore(1)],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 6,
  strength: 4,
  willpower: 5,
  illustrator: "Edu Francisco / Amanda Duarte",
  number: 32,
  set: "008",
  rarity: "common",
  lore: 2,
};
