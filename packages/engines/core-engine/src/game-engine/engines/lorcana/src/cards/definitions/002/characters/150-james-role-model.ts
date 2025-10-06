import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { putThisCardIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jamesRoleModel: LorcanaCharacterCardDefinition = {
  id: "seq",
  name: "James",
  title: "Role Model",
  characteristics: ["storyborn", "mentor"],
  text: "**NEVER, EVER LOSE SIGHT** When this character is banished, you may put this card into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "Never, Ever Lose Sight",
      text: "When this character is banished, you may put this card into your inkwell facedown and exerted.",
      optional: true,
      effects: [putThisCardIntoYourInkwellExerted],
    }),
  ],
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Kevin Hong",
  number: 150,
  set: "ROF",
  rarity: "common",
};
