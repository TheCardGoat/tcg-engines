import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanEnemyOfEntanglement: LorcanaCharacterCardDefinition = {
  id: "ums",
  name: "Mulan",
  title: "Enemy of Entanglement",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**TIME TO SHINE** Whenever you play an action, this character gets +2 {S} this turn.",
  type: "character",
  abilities: [
    wheneverPlays({
      name: "TIME TO SHINE",
      text: "Whenever you play an action, this character gets +2 {S} this turn.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "characteristics", value: ["action"] },
          { filter: "owner", value: "self" },
        ],
      },
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          modifier: "add",
          amount: 2,
          duration: "turn",
          target: thisCharacter,
        },
      ],
    }),
  ],
  flavour: "Ursula's messengers fled, leaving behind tendrils of dark ink.",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Jared Mathews",
  number: 115,
  set: "URR",
  rarity: "uncommon",
};
