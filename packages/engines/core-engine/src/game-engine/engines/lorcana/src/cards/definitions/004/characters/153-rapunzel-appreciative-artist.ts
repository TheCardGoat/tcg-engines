import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rapunzelAppreciativeArtist: LorcanaCharacterCardDefinition = {
  id: "jzp",
  missingTestCase: true,
  name: "Rapunzel",
  title: "Appreciative Artist",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**PERCEPTIVE PARTNER** While you have a character named Pascal in play, this character gains **Ward.** _(Opponents can't chose them except to challenge.)_",
  type: "character",
  abilities: [
    whileYouHaveACharacterNamedThisCharGains({
      name: "Perceptive Partner",
      text: "While you have a character named Pascal in play, this character gains **Ward.** _(Opponents can't chose them except to challenge.)_",
      characterName: "Pascal",
      ability: wardAbility,
    }),
  ],
  flavour: '"Pascal! A new flower for the wall!"',
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  illustrator: "Aubrey Archer",
  number: 153,
  set: "URR",
  rarity: "rare",
};
