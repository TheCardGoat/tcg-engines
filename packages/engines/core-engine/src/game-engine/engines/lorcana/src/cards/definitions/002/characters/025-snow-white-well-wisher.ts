import { returnCharacterFromDiscardToHand } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const snowWhiteWellWisher: LorcanaCharacterCardDefinition = {
  id: "xen",
  name: "Snow White",
  title: "Well Wisher",
  characteristics: ["hero", "floodborn", "princess"],
  text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Snow White.)_\n\n**WISHES COME TRUE** Whenever this character quests, you may return a character card from your discard to your hand.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Wishes Come True",
      text: "Whenever this character quests, you may return a character card from your discard to your hand.",
      optional: true,
      effects: [returnCharacterFromDiscardToHand],
    }),
    shiftAbility(4, "snow_white"),
  ],
  colors: ["amber"],
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  illustrator: "Javi Salas",
  number: 25,
  set: "ROF",
  rarity: "legendary",
};
