// TODO: Once the set is released, we organize the cards by set and type

import {
  mayBanish,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import { chosenItemOrLocation } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const wreckitRalphHamHands: LorcanaCharacterCardDefinition = {
  id: "td0",
  missingTestCase: true,
  name: "Wreck-it Ralph",
  title: "Ham Hands",
  characteristics: ["dreamborn", "hero"],
  text: "I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "I Wreck Things",
      text: "Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
      optional: true,
      effects: [mayBanish(chosenItemOrLocation), youGainLore(2)],
    }),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 3,
  illustrator: "Justin Runfola",
  number: 190,
  set: "006",
  rarity: "legendary",
};
