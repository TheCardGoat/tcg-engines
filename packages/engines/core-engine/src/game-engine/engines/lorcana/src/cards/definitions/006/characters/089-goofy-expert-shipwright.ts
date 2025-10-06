// TODO: Once the set is released, we organize the cards by set and type

import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goofyExpertShipwright: LorcanaCharacterCardDefinition = {
  id: "b51",
  name: "Goofy",
  title: "Expert Shipwright",
  characteristics: ["dreamborn", "hero", "inventor"],
  text: "Ward (Opponents can't choose this character except to challenge.)\nCLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.",
  type: "character",
  abilities: [
    wardAbility,
    wheneverQuests({
      name: "Clever Design",
      text: "Whenever this character quests, chosen character gains Ward until the start of your next turn.",
      effects: [
        {
          type: "ability",
          ability: "ward",
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 3,
  illustrator: "Max Ulichney",
  number: 89,
  set: "006",
  rarity: "rare",
};
