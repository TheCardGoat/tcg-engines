import { putThisCardIntoYourInkwellExerted } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const idunaCaringMother: LorcanaCharacterCardDefinition = {
  id: "oj8",
  name: "Iduna",
  title: "Caring Mother",
  characteristics: ["queen", "storyborn", "mentor"],
  text: "**ENDURING LOVE** When this character is banished, you may put this card into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "Enduring Love",
      text: "When this character is banished, you may put this card into your inkwell facedown and exerted.",
      optional: true,
      effects: [putThisCardIntoYourInkwellExerted],
    }),
  ],
  flavour:
    "Come my darling, homeward bound\nWhen all is lost, then all is found.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Jake Murphy",
  number: 147,
  set: "URR",
  rarity: "uncommon",
};
