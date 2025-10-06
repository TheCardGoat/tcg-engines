import { youPayXLessToPlayNextActionThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const iagoFakeFlamingo: LorcanitoCharacterCardDefinition = {
  id: "ebj",
  missingTestCase: true,
  name: "Iago",
  title: "Fake Flamingo",
  characteristics: ["storyborn", "ally"],
  text: "**IN DISGUISE** Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
  type: "character",
  abilities: [
    evasiveAbility,
    wheneverQuests({
      name: "In Disguise",
      text: "Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
      effects: [youPayXLessToPlayNextActionThisTurn(2)],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Hadjie Joos / Pix Smith",
  number: 79,
  set: "SSK",
  rarity: "rare",
};
