import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { readyAndCantQuestOrChallenge } from "@lorcanito/lorcana-engine/effects/effects";
import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import { wheneverYouHealAnyCharacter } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const auroraWakingBeauty: LorcanaCharacterCardDefinition = {
  id: "rgd",
  name: "Aurora",
  title: "Waking Beauty",
  characteristics: ["storyborn", "hero", "princess"],
  text: "Singer 5\nSWEET DREAMS Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
  type: "character",
  abilities: [
    singerAbility(5),
    wheneverYouHealAnyCharacter({
      name: "SWEET DREAMS",
      text: "Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
      effects: readyAndCantQuestOrChallenge(thisCharacter),
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 1,
  willpower: 4,
  illustrator: "Lisanne Konterman",
  number: 14,
  set: "007",
  rarity: "legendary",
  lore: 2,
};
