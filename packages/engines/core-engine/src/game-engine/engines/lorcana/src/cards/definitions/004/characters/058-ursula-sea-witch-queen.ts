import {
  otherCharacterGains,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { exertChosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulaSeaWitchQueen: LorcanaCharacterCardDefinition = {
  id: "k0n",
  name: "Ursula",
  title: "Sea Witch Queen",
  characteristics: ["floodborn", "queen", "sorcerer", "villain"],
  text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Ursula.)_\n\n\n**NOW I'M THE RULER** Whenever this character quests, exert chosen character.\n\n\n**YOU'LL LISTEN TO ME!** Other characters can't exert to sing songs.",
  type: "character",
  abilities: [
    shiftAbility(5, "ursula"),
    wheneverQuests({
      name: "NOW I'M THE RULER",
      text: "Whenever this character quests, exert chosen character",
      effects: [exertChosenCharacter],
    }),
    otherCharacterGains({
      name: "YOU'LL LISTEN TO ME!",
      text: "Other characters can't exert to sing songs.",
      gainedAbility: {
        type: "static",
        ability: "voiceless",
      },
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 7,
  strength: 4,
  willpower: 7,
  lore: 3,
  illustrator: "Lady Shalvin",
  number: 58,
  set: "URR",
  rarity: "legendary",
};
