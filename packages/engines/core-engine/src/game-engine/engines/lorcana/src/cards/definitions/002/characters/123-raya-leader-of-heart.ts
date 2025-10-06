import { damageDealtRestrictionEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rayaLeaderOfHeart: LorcanitoCharacterCardDefinition = {
  id: "c4z",
  name: "Raya",
  title: "Leader of Heart",
  characteristics: ["hero", "floodborn", "princess"],
  text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Raya.)_\n\n**CHAMPION OF KUMANDRA** Whenever this character challenges a damaged character, she takes no damage from the challenge.",
  type: "character",
  abilities: [
    shiftAbility(4, "raya"),
    wheneverChallengesAnotherChar({
      name: "CHAMPION OF KUMANDRA",
      text: "Whenever this character challenges a damaged character, she takes no damage from the challenge.",
      defenderFilter: [{ filter: "status", value: "damaged" }],
      effects: [damageDealtRestrictionEffect],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 6,
  strength: 5,
  willpower: 3,
  lore: 2,
  illustrator: "Amber Kommavongsa",
  number: 123,
  set: "ROF",
  rarity: "super_rare",
};
