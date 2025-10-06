// TODO: Once the set is released, we organize the cards by set and type

import { thisCharacterGetsLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverYouPlayAnItem } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gadgetHackwrenchCreativeThinker: LorcanaCharacterCardDefinition = {
  id: "vqq",
  missingTestCase: true,
  name: "Gadget Hackwrench",
  title: "Creative Thinker",
  characteristics: ["storyborn", "ally", "inventor"],
  text: "BRAINSTORM Whenever you play an item, this character gets +1 {L} this turn.",
  type: "character",
  abilities: [
    wheneverYouPlayAnItem({
      name: "Brainstorm",
      text: "Whenever you play an item, this character gets +1 {L} this turn.",
      effects: [thisCharacterGetsLore(1)],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Andrea Fernandez",
  number: 139,
  set: "006",
  rarity: "common",
};
