import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverTargetPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princeJohnOpportunisticBriber: LorcanaCharacterCardDefinition = {
  id: "xu2",
  name: "Prince John",
  title: "Opportunistic Briber",
  characteristics: ["dreamborn", "villain", "prince"],
  text: "**TAXES NEVER FAIL ME** Whenever you play an item, this character gets +2 {S} this turn.",
  type: "character",
  abilities: [
    wheneverTargetPlays({
      name: "TAXES NEVER FAIL ME",
      text: "Whenever you play an item, this character gets +2 {S} this turn.",
      triggerFilter: [
        { filter: "type", value: "item" },
        { filter: "owner", value: "self" },
      ],
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: thisCharacter,
          duration: "turn",
        },
      ],
    }),
  ],
  flavour: "Of course I’m on the list. Check under ‘PJ.’",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  illustrator: "Carlos Gomes Cabral",
  number: 141,
  set: "SSK",
  rarity: "common",
};
