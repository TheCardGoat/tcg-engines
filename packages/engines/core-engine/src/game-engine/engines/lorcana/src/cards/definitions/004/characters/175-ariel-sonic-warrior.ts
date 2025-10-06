import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverYouPlayASong } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielSonicWarrior: LorcanaCharacterCardDefinition = {
  id: "v5n",
  reprints: ["hbk"],
  missingTestCase: true,
  name: "Ariel",
  title: "Sonic Warrior",
  characteristics: ["hero", "floodborn", "princess"],
  text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Ariel.)_\n<br>\n**AMPLIFIED VOICE** Whenever you play a song, you may pay {I} to deal 3 daamge to chosen character.",
  type: "character",
  abilities: [
    shiftAbility(4, "Ariel"),
    wheneverYouPlayASong({
      name: "**AMPLIFIED VOICE**",
      text: "Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.",
      optional: true,
      costs: [{ type: "ink", amount: 2 }],
      effects: [dealDamageEffect(3, chosenCharacter)],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 3,
  willpower: 8,
  lore: 2,
  illustrator: "Marcel Berg",
  number: 175,
  set: "URR",
  rarity: "super_rare",
};
