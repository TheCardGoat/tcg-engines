// TODO: Once the set is released, we organize the cards by set and type

import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const calhounMarineSergeant: LorcanaCharacterCardDefinition = {
  id: "tju",
  name: "Calhoun",
  title: "Marine Sergeant",
  characteristics: ["storyborn", "hero"],
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\n\n**LEVEL UP** During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
  type: "character",
  abilities: [
    resistAbility(1),
    wheneverBanishesAnotherCharacterInChallenge({
      name: "LEVEL UP",
      text: "During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
      effects: [
        {
          type: "lore",
          amount: 2,
          modifier: "add",
          target: self,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Kevin Sidharta",
  number: 191,
  set: "006",
  rarity: "rare",
};
