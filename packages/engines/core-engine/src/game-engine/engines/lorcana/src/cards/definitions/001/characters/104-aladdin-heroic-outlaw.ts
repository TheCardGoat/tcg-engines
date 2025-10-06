import {
  opponentLoseLore,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aladdinHeroicOutlaw: LorcanitoCharacterCardDefinition = {
  id: "c0t",
  name: "Aladdin",
  title: "Heroic Outlaw",
  characteristics: ["hero", "floodborn"],
  text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
  type: "character",
  abilities: [
    wheneverBanishesAnotherCharacterInChallenge({
      name: "Daring Exploit",
      text: "During your turn, whenever this character banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
      effects: [youGainLore(2), opponentLoseLore(2)],
    }),
    shiftAbility(5, "Aladdin"),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "Nicholas Kole",
  number: 104,
  set: "TFC",
  rarity: "super_rare",
};
